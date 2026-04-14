const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'hospital.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('PRAGMA journal_mode = WAL;', (err) => {
        if (err) console.error("Could not set WAL mode:", err.message);
        else console.log("SQLite WAL mode activated.");
    });
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Appointments Table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      department TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Scheduled',
      pg_id INTEGER DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // Migrate: add pg_id column if not exists (safe for existing DBs)
    db.run(`ALTER TABLE appointments ADD COLUMN pg_id INTEGER DEFAULT NULL`, () => {});
    // Complaints Table
    db.run(`CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      room_no TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Contact Messages Table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Gallery Table
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      caption TEXT,
      category TEXT DEFAULT 'Campus',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Applications Table (Admissions)
    db.run(`CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      neet_score INTEGER,
      status TEXT DEFAULT 'Pending Review',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Academic Materials Table (Digital Library)
    db.run(`CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      department TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Schedules Table
    db.run(`CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      subject TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL
    )`);

    // Follow-ups Table
    db.run(`CREATE TABLE IF NOT EXISTS follow_ups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      description TEXT NOT NULL,
      urgent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Queue Status Table
    db.run(`CREATE TABLE IF NOT EXISTS queue_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department TEXT UNIQUE NOT NULL,
      serving_number INTEGER DEFAULT 0,
      est_wait_mins INTEGER DEFAULT 15,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Case Logs Table (For PG)
    db.run(`CREATE TABLE IF NOT EXISTS case_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pg_id INTEGER NOT NULL,
      patient_name TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      procedure TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY(pg_id) REFERENCES users(id)
    )`);

    // Attendance Table (For Students)
    db.run(`CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(student_id) REFERENCES users(id)
    )`);

    // News Feed / Notices Table
    db.run(`CREATE TABLE IF NOT EXISTS news_feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      pinned BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Exams Table
    db.run(`CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      location TEXT NOT NULL
    )`);

    // Events Table (Calendar)
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      event_date TEXT NOT NULL,
      month TEXT NOT NULL,
      year TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT DEFAULT 'Academic',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Faculty Table
    db.run(`CREATE TABLE IF NOT EXISTS faculty (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      dept TEXT NOT NULL,
      specialty TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    seedAdmin();
    seedRealSystemData();
  });
}

function seedAdmin() {
  db.get("SELECT * FROM users WHERE email = 'admin@rrdch.org'", (err, row) => {
    if (!row) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin123', salt);
      db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
        ['System Admin', 'admin@rrdch.org', hash, 'admin']
      );
    }
  });
}

function seedRealSystemData() {
    // Queues
    db.get("SELECT count(*) as count FROM queue_status", (err, row) => {
        if (!row || row.count === 0) {
            const queues = [
                ['Oral Medicine & Radiology', 12, 10],
                ['Prosthetics & Crown & Bridge', 8, 25],
                ['Periodontology Clinics', 5, 5],
                ['Orthodontics OPD', 34, 45],
                ['Conservative Dentistry', 19, 20]
            ];
            const stmtQueue = db.prepare("INSERT OR IGNORE INTO queue_status (department, serving_number, est_wait_mins) VALUES (?, ?, ?)");
            queues.forEach(q => stmtQueue.run(q));
            stmtQueue.finalize();
        }
    });

    // Materials
    db.get("SELECT count(*) as count FROM materials", (err, row) => {
        if (!row || row.count === 0) {
            const mats = [
                ['BDS 1st Year Anatomy Syllabus', 'PDF', 'General Human Anatomy'],
                ['MDS Oral Pathology Reading List', 'DOCX', 'Oral & Maxillofacial Pathology'],
                ['Dental Implantology Foundations', 'PDF', 'Implantology'],
                ['DCI Revised Regulations 2026', 'PDF', 'Public Health Dentistry']
            ];
            const stmtMat = db.prepare("INSERT INTO materials (title, type, department) VALUES (?, ?, ?)");
            mats.forEach(m => stmtMat.run(m));
            stmtMat.finalize();
        }
    });

    // Schedules
    db.get("SELECT count(*) as count FROM schedules", (err, row) => {
        if (!row || row.count === 0) {
            const scheds = [
                ['MONDAY', '09:00 AM - 12:00 PM', 'Conservative Dentistry Clinic', 'Clinical Block A, 2nd Floor', 'CLINIC'],
                ['MONDAY', '01:00 PM - 03:00 PM', 'Oral Pathology Theory', 'Lecture Hall 4', 'THEORY'],
                ['TUESDAY', '09:00 AM - 01:00 PM', 'Prosthodontics Pre-Clinical', 'Phantom Head Lab', 'PRACTICAL'],
                ['WEDNESDAY', '10:00 AM - 12:00 PM', 'Public Health Camp Briefing', 'Seminar Room H', 'SEMINAR']
            ];
            const stmtSched = db.prepare("INSERT INTO schedules (day, time_slot, subject, location, type) VALUES (?, ?, ?, ?, ?)");
            scheds.forEach(s => stmtSched.run(s));
            stmtSched.finalize();
        }
    });

    // News
    db.get("SELECT count(*) as count FROM news_feed", (err, row) => {
        if (!row || row.count === 0) {
            const news = [
              ['Campus Remodel Phase 2', 'The new digital library section is operational. All PGs can access it starting Monday.', 'Dean', 1],
              ['Upcoming Free Checkup Camp', 'Medical camp in Kumbalgodu on August 15. Volunteers required.', 'Admin', 0]
            ];
            const stmtNews = db.prepare("INSERT INTO news_feed (title, content, author, pinned) VALUES (?, ?, ?, ?)");
            news.forEach(n => stmtNews.run(n));
            stmtNews.finalize();
        }
    });

    // Exams
    db.get("SELECT count(*) as count FROM exams", (err, row) => {
        if (!row || row.count === 0) {
            const examsData = [
              ['Oral Surgery Theory', '2026-05-15', '10:00 AM - 01:00 PM', 'Main Hall A'],
              ['Periodontology Practical', '2026-05-18', '09:00 AM - 12:00 PM', 'Lab 3']
            ];
            const stmtExams = db.prepare("INSERT INTO exams (subject, exam_date, time_slot, location) VALUES (?, ?, ?, ?)");
            examsData.forEach(e => stmtExams.run(e));
            stmtExams.finalize();
        }
    });
}

module.exports = db;
