import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { BookOpen, Calendar, Home, AlertCircle, FileText, CheckCircle, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  
  const navLinks = [
      { heading: 'Academics' },
      { id: 'schedule', icon: <Calendar size={20} />, label: 'Clinical Rotations', path: '/student-dashboard/schedule' },
      { id: 'syllabus', icon: <BookOpen size={20} />, label: 'Digital Library', path: '/student-dashboard/syllabus' },
      { id: 'exams', icon: <FileText size={20} />, label: 'Exam Timetable', path: '/student-dashboard/exams' },
      { id: 'attendance', icon: <CheckCircle size={20} />, label: 'Attendance', path: '/student-dashboard/attendance' },
      { heading: 'Campus Life' },
      { id: 'hostel', icon: <Home size={20} />, label: 'Hostel Services', path: '/student-dashboard/hostel' },
      { id: 'notices', icon: <AlertCircle size={20} />, label: 'Official Notices', path: '/student-dashboard/notices' },
  ];

  return (
    <DashboardLayout 
        title="Academic Portal" 
        subtitle="Central hub for clinical schedules & digital library." 
        navigationLinks={navLinks}
        accentColor="#7C3AED"
        headerActions={
            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                Secure Logout
            </button>
        }
    >
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontWeight: '800' }}>Academic Hub</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, <span className="font-bold text-primary">{user?.name}</span>.</p>
            </div>
            <div style={{ padding: '0.75rem 1.5rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
               <div className="text-xs text-muted uppercase font-bold tracking-wider">Current Batch</div>
               <div className="text-lg font-bold text-primary">BDS 2026</div>
            </div>
        </div>

        <div className="card shadow-md border-0" style={{ minHeight: '600px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
          <Routes>
            <Route path="/" element={<NavigateToSchedule />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="syllabus" element={<SyllabusUpdates />} />
            <Route path="exams" element={<ExamsView />} />
            <Route path="attendance" element={<AttendanceTracker />} />
            <Route path="hostel" element={<HostelComplaints />} />
            <Route path="notices" element={<NoticesView />} />
          </Routes>
        </div>
    </DashboardLayout>
  );
};

const NavigateToSchedule = () => <Navigate to="/student-dashboard/schedule" replace />;

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
      fetch('/api/schedules')
        .then(res => res.json())
        .then(data => { setSchedules(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
  }, []);
  
  if(loading) return <Loader message="Fetching your clinical rotations..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="border-b pb-4 mb-4 border-[color:var(--border-color)]">
        <h2>Clinical Postings &amp; Classes</h2>
        <p className="text-muted">Your mandatory attendance schedule - posted by the administration.</p>
      </div>
      
      <div className="grid gap-6">
        {schedules.length === 0 ? (
            <div className="p-8 text-center text-muted italic border-2 border-dashed rounded-lg">No classes scheduled.</div>
        ) : schedules.map((cls, i) => (
          <div key={i} className="p-6 flex justify-between items-center bg-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" style={{ border: '1px solid var(--border-color)', borderLeft: cls.type==='CLINIC' ? '6px solid var(--secondary)' : '6px solid var(--primary)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <span className={`badge mb-3 ${cls.type === 'CLINIC' ? 'badge-success' : 'badge-warning'}`}>{cls.day} * {cls.type}</span>
              <h3 className="text-primary mt-1 mb-1">{cls.subject}</h3>
              <div className="font-medium text-muted">{cls.location}</div>
            </div>
            <div className="text-right flex flex-col items-end gap-2 font-bold p-4 bg-main rounded-md">
              <Calendar size={20} className="text-primary" />
              <span className="text-lg text-primary">{cls.time_slot}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SyllabusUpdates = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        fetch('/api/materials')
            .then(res => res.json())
            .then(data => { setMaterials(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    if(loading) return <Loader message="Accessing digital library..." />;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="border-b pb-4 mb-4 border-[color:var(--border-color)]">
          <h2>Digital Library & Syllabus</h2>
          <p className="text-muted">Download latest course materials, guidelines, and reading lists.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {materials.length === 0 ? (
            <div className="col-span-2 p-8 text-center text-muted italic border-2 border-dashed rounded-lg">No materials available in library.</div>
          ) : materials.map((doc, i) => (
            <div key={i} className="p-6 flex items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '50%' }}>
                <FileText size={24} color="var(--primary)" />
              </div>
              <div className="flex-grow">
                <h4 className="text-lg text-primary mb-1 leading-tight">{doc.title}</h4>
                <span className="text-sm text-muted font-bold block">{doc.type} Document * {doc.department}</span>
                <span className="text-xs text-muted block mt-2">Posted: {new Date(doc.upload_date).toLocaleDateString()}</span>
              </div>
              <button
                className="btn p-3 bg-main text-primary hover:bg-primary hover:text-white rounded-full"
                title={doc.url ? 'Download / View' : 'No file attached'}
                onClick={() => doc.url ? window.open(doc.url, '_blank') : alert('No download URL attached to this material. Ask admin to add a file URL.')}
              >
                 <DownloadCloud size={20} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    );
};

const ExamsView = () => {
  const [exams, setExams] = useState([]);
  useEffect(() => { 
      fetch('/api/exams')
        .then(r=>r.json())
        .then(data => setExams(Array.isArray(data) ? data : []))
        .catch(() => setExams([])); 
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="border-b pb-4 mb-4 border-[color:var(--border-color)]">
        <h2>Exam Timetable</h2>
        <p className="text-muted">Upcoming internal and external assessments.</p>
      </div>
      <div className="grid gap-4">
        {exams.map(ex => (
          <div key={ex.id} className="p-5 border rounded-lg bg-white flex justify-between items-center" style={{borderColor: 'var(--border-color)'}}>
            <div>
              <h3 className="text-primary m-0">{ex.subject}</h3>
              <p className="text-muted m-0 mt-1">{ex.location}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-secondary">{ex.exam_date}</div>
              <div className="text-sm text-muted">{ex.time_slot}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AttendanceTracker = () => {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  useEffect(() => { 
      fetch('/api/attendance', {headers: {'Authorization': `Bearer ${token}`}})
        .then(r=>r.json())
        .then(data => setRecords(Array.isArray(data) ? data : []))
        .catch(() => setRecords([])); 
  }, [token]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="border-b pb-4 mb-4 border-[color:var(--border-color)]">
        <h2>Attendance Tracker</h2>
        <p className="text-muted">Minimum 75% aggregate attendance required to sit for exams.</p>
      </div>
      <div className="grid gap-4">
        {records.length === 0 ? <p className="text-muted italic">No attendance records found.</p> : records.map(rec => (
          <div key={rec.id} className="p-4 border rounded shadow-sm bg-white flex justify-between items-center" style={{borderColor: 'var(--border-color)', borderLeft: rec.status==='Present' ? '4px solid var(--success)' : '4px solid var(--danger)'}}>
            <div>
               <h4 className="m-0 text-primary">{rec.subject}</h4>
               <span className="text-sm text-muted">{rec.date}</span>
            </div>
            <span className={`badge ${rec.status==='Present'?'badge-success':'badge-warning'}`}>{rec.status}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const NoticesView = () => {
  const [news, setNews] = useState([]);
  useEffect(() => { 
      fetch('/api/news')
        .then(r=>r.json())
        .then(data => setNews(Array.isArray(data) ? data : []))
        .catch(() => setNews([])); 
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="border-b pb-4 mb-4 border-[color:var(--border-color)]">
        <h2>Official Notices</h2>
        <p className="text-muted">Important circulars from the Principal's Office.</p>
      </div>
      <div className="flex flex-col gap-4">
        {news.map(n => (
          <div key={n.id} className="p-5 border rounded bg-white shadow-sm" style={{borderColor: 'var(--border-color)', borderLeft: n.pinned ? '4px solid var(--secondary)' : '4px solid var(--border-color)'}}>
            <h4 className="m-0 text-primary">{n.title}</h4>
            <p className="text-muted mt-2 text-sm">{n.content}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const HostelComplaints = () => {
    const { token } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [room_no, setRoom] = useState('');
    const [category, setCat] = useState('');
    const [description, setDesc] = useState('');
    
    const handleComplaint = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ room_no, category, description })
            });
            if(res.ok) setSubmitted(true);
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

  if(loading) return <Loader fullScreen message="Registering your complaint with the Warden Office..." />;

  return submitted ? (
    <div className="text-center py-20 text-success">
      <CheckCircle size={80} style={{ margin: '0 auto 1.5rem' }} />
      <h2 style={{ fontSize: '2.5rem' }}>Ticket Raised</h2>
      <p className="text-lg mt-4 max-w-md mx-auto text-muted">Your hostel complaint has been safely logged. The warden will dispatch maintenance shortly.</p>
      <button className="btn btn-outline mt-8" onClick={() => {setSubmitted(false); setDesc('');}}>Raise Another Ticket</button>
    </div>
  ) : (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex items-start justify-between border-b pb-4 mb-4 border-[color:var(--border-color)]">
        <div>
          <h2>Hostel Maintenance</h2>
          <p className="text-muted">Report electrical, plumbing, or facility issues for rapid resolution.</p>
        </div>
        <span className="badge flex items-center gap-2 py-2 px-4 shadow-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
          <AlertCircle size={16} /> Urgent: Call Warden Extension 402
        </span>
      </div>
      
      <form className="flex flex-col gap-6" onSubmit={handleComplaint}>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm tracking-wide text-primary uppercase">Room Allocation</label>
            <input type="text" placeholder="e.g. Boys Block B - 104" required className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={room_no} onChange={e=>setRoom(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm tracking-wide text-primary uppercase">Issue Category</label>
            <select required className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={category} onChange={e=>setCat(e.target.value)}>
              <option value="">-- Select Department --</option>
              <option value="electrical">Electrical (Lights, Fans, Sockets)</option>
              <option value="plumbing">Plumbing (Water, Toilets)</option>
              <option value="cleaning">Housekeeping / Cleaning</option>
              <option value="wifi">Wi-Fi / Internet Network</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="font-bold text-sm tracking-wide text-primary uppercase">Detailed Description</label>
            <textarea rows="6" placeholder="Describe the issue clearly so maintenance knows what tools to bring..." required className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={description} onChange={e=>setDesc(e.target.value)}></textarea>
        </div>

        <div className="mt-4 pt-4 border-t" style={{borderTop: '1px solid var(--border-color)'}}>
            <button type="submit" className="btn btn-primary py-4 px-8 shadow-md text-lg">Lodge Official Complaint</button>
        </div>
      </form>
    </motion.div>
  );
};

export default StudentDashboard;

