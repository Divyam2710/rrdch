require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File uploads setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
app.use('/uploads', express.static(uploadsDir));

const serverStart = Date.now();

// Security: Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set in environment variables! Using fallback for development only.");
}
const SECRET_KEY = JWT_SECRET || 'rrdch-super-secret-key-2026';

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Requires admin privileges' });
  }
  next();
};

// --- AUTH ROUTES ---
// Apply strict rate limiting to login to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased to 100 during development to prevent locking out the admin
  message: { error: 'Too many failed login attempts, please try again after 15 minutes.' }
});

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

app.post('/api/admin/create-user', authenticateToken, requireAdmin, (req, res) => {
  const { name, email, password, role } = req.body;

  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  if (!['admin', 'pg', 'student', 'patient'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hash, role], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'User created successfully', userId: this.lastID });
  });
});

// --- APPOINTMENTS ROUTES ---
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 bookings per IP per hour
  message: { error: 'Too many booking requests from this IP, please try again later.' }
});

app.post('/api/appointments', bookingLimiter, (req, res) => {
  const { patient_name, phone, department, date } = req.body;
  if (!patient_name || !phone || !department || !date) return res.status(400).json({ error: 'Missing fields' });
  if (phone.length < 10) return res.status(400).json({ error: 'Invalid phone number format' });

  db.run("INSERT INTO appointments (patient_name, phone, department, date) VALUES (?, ?, ?, ?)",
    [patient_name, phone, department, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Appointment booked successfully' });
    }
  );
});

app.get('/api/appointments', (req, res) => {
  const phone = req.query.phone;
  const id = req.query.id;

  // Public: patient tracking by phone + ID
  if (phone && id) {
    db.all("SELECT * FROM appointments WHERE phone = ? AND id = ? ORDER BY date ASC LIMIT 10", [phone, id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
    return;
  }

  // Protected: require token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    if (user.role === 'admin') {
      // Admin sees ALL appointments with pg name joined
      db.all(`SELECT a.*, u.name as pg_name FROM appointments a 
              LEFT JOIN users u ON a.pg_id = u.id 
              WHERE a.status != 'Cancelled' OR (a.status = 'Cancelled' AND a.created_at >= datetime('now', '-1 day'))
              ORDER BY a.date ASC LIMIT 200`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      });
    } else if (user.role === 'pg') {
      // PG doctor sees ONLY their assigned patients
      db.all("SELECT * FROM appointments WHERE pg_id = ? ORDER BY date ASC", [user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      });
    } else {
      return res.status(403).json({ error: 'Requires admin or PG token' });
    }
  });
});

app.put('/api/appointments/:id/cancel', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required to verify cancellation' });
  db.run("UPDATE appointments SET status = 'Cancelled' WHERE id = ? AND phone = ?", [req.params.id, phone], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Appointment not found or incorrect phone number' });
    res.json({ message: 'Appointment cancelled successfully' });
  });
});

// Admin assigns a patient appointment to a specific PG doctor
app.put('/api/appointments/:id/assign', authenticateToken, requireAdmin, (req, res) => {
  const { pg_id } = req.body;
  db.run("UPDATE appointments SET pg_id = ? WHERE id = ?", [pg_id || null, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Patient assigned successfully' });
  });
});

// Get all PG doctors (for admin assignment dropdown)
app.get('/api/pgs', authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT id, name, email FROM users WHERE role = 'pg'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/appointments/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const allowedStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];
  if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status string' });

  db.run("UPDATE appointments SET status = ? WHERE id = ?", [req.body.status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
});

// --- COMPLAINTS ROUTES ---
app.post('/api/complaints', authenticateToken, (req, res) => {
  const { room_no, category, description } = req.body;
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can file complaints' });

  db.run("INSERT INTO complaints (user_id, room_no, category, description) VALUES (?, ?, ?, ?)",
    [req.user.id, room_no, category, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Complaint filed successfully' });
    }
  );
});

app.get('/api/complaints', authenticateToken, (req, res) => {
  db.all("SELECT * FROM complaints ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- CONTACT ROUTES ---
app.post('/api/contact', apiLimiter, (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  db.run("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Message sent successfully' });
    }
  );
});

app.put('/api/complaints/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const allowedStatuses = ['Open', 'Resolved', 'In Progress'];
  if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status string' });

  db.run("UPDATE complaints SET status = ? WHERE id = ?", [req.body.status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
});

// --- FOLLOW UP ROUTES ---
app.post('/api/follow-up', apiLimiter, (req, res) => {
  const { phone, description, urgent } = req.body;

  if (!phone || typeof phone !== 'string' || phone.length < 10) {
    return res.status(400).json({ error: 'Valid phone number is required' });
  }
  if (!description || typeof description !== 'string' || description.length > 1000) {
    return res.status(400).json({ error: 'Valid description is required (max 1000 chars)' });
  }

  db.run("INSERT INTO follow_ups (phone, description, urgent) VALUES (?, ?, ?)",
    [phone, description, urgent ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      console.log(`[Follow-Up Logged] ID: ${this.lastID}, Urgent: ${urgent}`);
      res.status(201).json({ message: 'Follow-up logged successfully.' });
    }
  );
});

// --- NEW CRM ROUTES ---
app.get('/api/schedules', (req, res) => {
  db.all("SELECT * FROM schedules", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/schedules', authenticateToken, requireAdmin, (req, res) => {
  const { day, time_slot, subject, location, type } = req.body;
  if (!day || !time_slot || !subject || !location || !type) return res.status(400).json({ error: "Missing fields" });
  db.run("INSERT INTO schedules (day, time_slot, subject, location, type) VALUES (?, ?, ?, ?, ?)", [day, time_slot, subject, location, type], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.delete('/api/schedules/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM schedules WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.get('/api/materials', (req, res) => {
  db.all("SELECT * FROM materials ORDER BY upload_date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/materials', authenticateToken, requireAdmin, (req, res) => {
  const { title, type, department } = req.body;
  if (!title || !type || !department) return res.status(400).json({ error: "Missing fields" });
  db.run("INSERT INTO materials (title, type, department) VALUES (?, ?, ?)", [title, type, department], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.delete('/api/materials/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM materials WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.get('/api/queue', (req, res) => {
  db.all("SELECT * FROM queue_status", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT id, name, email, role, created_at FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/create-user', authenticateToken, requireAdmin, (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const hash = bcrypt.hashSync(password, 10);
  
  db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
    [name, email, hash, role], 
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'User created successfully' });
  });
});

app.put('/api/admin/reset-password/:id', authenticateToken, requireAdmin, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'Need new password' });
  const hash = bcrypt.hashSync(newPassword, 10);
  db.run("UPDATE users SET password = ? WHERE id = ?", [hash, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Password forcibly reset' });
  });
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  if (parseInt(req.params.id) === req.user.id) return res.status(403).json({ error: "Cannot delete your own admin account" });

  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

app.put('/api/queue/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'pg') return res.status(403).json({ error: 'Forbidden' });

  const { serving_number, est_wait_mins } = req.body;

  // Dynamic update depending on what is sent (assuming pg dashboard might send just serving_number or both)
  if (serving_number === undefined && est_wait_mins === undefined) return res.status(400).json({ error: 'No valid data provided' });

  let updates = [];
  let params = [];
  if (serving_number !== undefined) {
    updates.push("serving_number = ?");
    params.push(serving_number);
  }
  if (est_wait_mins !== undefined) {
    updates.push("est_wait_mins = ?");
    params.push(est_wait_mins);
  }

  params.push(req.params.id);

  db.run(`UPDATE queue_status SET ${updates.join(', ')}, last_updated = CURRENT_TIMESTAMP WHERE id = ?`, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
});

// --- STAGE 3 ROUTES ---
app.get('/api/news', (req, res) => {
  db.all("SELECT * FROM news_feed ORDER BY pinned DESC, created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/news', authenticateToken, requireAdmin, (req, res) => {
  const { title, content, author, pinned } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
  db.run("INSERT INTO news_feed (title, content, author, pinned) VALUES (?, ?, ?, ?)", [title, content, author || 'Admin', pinned ? 1 : 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'News added successfully' });
  });
});

app.delete('/api/admin/news/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM news_feed WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'News deleted successfully' });
  });
});

app.get('/api/exams', (req, res) => {
  db.all("SELECT * FROM exams ORDER BY exam_date ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/attendance', authenticateToken, (req, res) => {
  db.all("SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/case-logs', authenticateToken, (req, res) => {
  db.all("SELECT * FROM case_logs WHERE pg_id = ? ORDER BY date DESC", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/case-logs', authenticateToken, (req, res) => {
  if (req.user.role !== 'pg') return res.status(403).json({ error: 'Only PGs can log cases' });

  const { patient_name, diagnosis, procedure, date } = req.body;
  db.run("INSERT INTO case_logs (pg_id, patient_name, diagnosis, procedure, date) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, patient_name, diagnosis, procedure, date], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// --- PHASE 6 ROUTES (GALLERY & ADMISSIONS) ---
app.get('/api/gallery', (req, res) => {
  db.all("SELECT * FROM gallery ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/gallery', authenticateToken, requireAdmin, (req, res) => {
  const { url, caption, category } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  db.run("INSERT INTO gallery (url, caption, category) VALUES (?, ?, ?)", [url, caption, category], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Photo added globally' });
  });
});

app.delete('/api/admin/gallery/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM gallery WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Photo deleted globally' });
  });
});

app.post('/api/applications', (req, res) => {
  const { name, phone, email, type, neet_score } = req.body;
  if (!name || !phone || !email || !type) return res.status(400).json({ error: 'Missing core application fields' });
  db.run("INSERT INTO applications (name, phone, email, type, neet_score) VALUES (?, ?, ?, ?, ?)",
    [name, phone, email, type, neet_score], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Application submitted successfully. Faculty will contact you shortly.' });
    });
});

// --- IMAGE UPLOAD ---
app.post('/api/admin/upload-image', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, message: 'Image uploaded successfully' });
});

// --- EVENTS ROUTES ---
app.get('/api/events', (req, res) => {
  db.all("SELECT * FROM events ORDER BY event_date ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/events', authenticateToken, requireAdmin, (req, res) => {
  const { title, event_date, month, year, time, location, type } = req.body;
  if (!title || !event_date || !time || !location) return res.status(400).json({ error: 'Missing required fields' });
  const m = month || new Date(event_date).toLocaleString('en', { month: 'long' });
  const y = year || new Date(event_date).getFullYear().toString();
  db.run("INSERT INTO events (title, event_date, month, year, time, location, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, event_date, m, y, time, location, type || 'Academic'], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM events WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- FACULTY ROUTES ---
app.get('/api/faculty', (req, res) => {
  db.all("SELECT * FROM faculty ORDER BY dept ASC, name ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admin/faculty', authenticateToken, requireAdmin, (req, res) => {
  const { name, role, dept, specialty } = req.body;
  if (!name || !role || !dept) return res.status(400).json({ error: 'Name, role and department required' });
  db.run("INSERT INTO faculty (name, role, dept, specialty) VALUES (?, ?, ?, ?)",
    [name, role, dept, specialty || ''], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

app.delete('/api/admin/faculty/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM faculty WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- SYSTEM STATUS ---
app.get('/api/admin/system-status', authenticateToken, requireAdmin, (req, res) => {
  const uptimeMs = Date.now() - serverStart;
  const uptimeHrs = Math.floor(uptimeMs / 3600000);
  const uptimeMins = Math.floor((uptimeMs % 3600000) / 60000);
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    res.json({
      status: 'online',
      uptime: `${uptimeHrs}h ${uptimeMins}m`,
      tables: tables.map(t => t.name),
      node_version: process.version,
      timestamp: new Date().toISOString()
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
