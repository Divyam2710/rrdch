import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Activity, Calendar, Clock, Stethoscope, FileText, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import DashboardLayout from '../components/DashboardLayout';
import LiveQueueControl from '../components/LiveQueueControl';

const PgDashboard = () => {
    const { user, logout } = useAuth();

    const navLinks = [
        { heading: 'Clinical Operations' },
        { id: 'live-schedule', icon: <Activity size={20} />, label: 'Live Schedule', path: '/pg-dashboard/live-schedule' },
        { id: 'case-logs', icon: <FileText size={20} />, label: 'Case Logs', path: '/pg-dashboard/case-logs' },
        { heading: 'Academics & Duty' },
        { id: 'roster', icon: <Calendar size={20} />, label: 'Duty Roster', path: '/pg-dashboard/roster' },
        { id: 'research', icon: <BookOpen size={20} />, label: 'Research Papers', path: '/pg-dashboard/research' }
    ];

    return (
        <DashboardLayout 
            title="Doctor Portal" 
            subtitle="Clinical Management & Patient Tracking" 
            navigationLinks={navLinks}
            accentColor="#B45309"
            headerActions={
                <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    Secure Logout
                </button>
            }
        >
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontWeight: '800' }}>Doctor Portal</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, Dr. <span className="font-bold text-primary">{user?.name}</span>.</p>
                </div>
            </div>

            <div className="card shadow-md border-0" style={{ minHeight: '600px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="live-schedule" replace />} />
                    <Route path="live-schedule" element={<LiveSchedule />} />
                <Route path="case-logs" element={<CaseLogs />} />
                    <Route path="roster" element={<DutyRoster />} />
                    <Route path="research" element={<ResearchPapers />} />
                </Routes>
            </div>
        </DashboardLayout>
    );
};

const LiveSchedule = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/appointments', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [token]);

    if(loading) return <Loader message="Synchronizing clinical schedules..." />;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 p-2">
        
        {/* DOCTOR AVAILABILITY SECTION */}
        <div className="flex justify-between items-center mb-4 border-b pb-4 border-[color:var(--border-color)]">
          <div>
              <h2>Live Waiting Room Status</h2>
              <p className="text-muted text-sm">Update your clinical status to alert patients in the Queue.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            <LiveQueueControl token={token} department="Oral Surgery" />
            <LiveQueueControl token={token} department="Orthodontics" />
            <LiveQueueControl token={token} department="Pedodontics" />
            <LiveQueueControl token={token} department="Prosthodontics" />
        </div>

        {/* APPOINTMENT LISTING SECTION */}
        <div className="flex justify-between items-center border-b pb-4 mb-4 mt-8 border-[color:var(--border-color)]">
          <div>
              <h2>Incoming Appointments</h2>
              <p className="text-muted text-sm">Your assigned patients for today. Assignments are managed by the admin.</p>
          </div>
          <span className="badge badge-success flex items-center gap-2 px-4 py-2">
            <div style={{ width: 8, height: 8, background: '#05c46b', borderRadius: '50%' }}></div> Live Sync
          </span>
        </div>
    
        <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)', background: 'rgba(43,58,49,0.05)' }}>
                <th className="p-4 font-bold text-primary">Time / Date</th>
                <th className="p-4 font-bold text-primary">Patient Name</th>
                <th className="p-4 font-bold text-primary">Department</th>
                <th className="p-4 font-bold text-primary">Status</th>
                </tr>
            </thead>
            <tbody>
                {appointments.length === 0 ? (
                    <tr><td colSpan="4" className="text-center p-8 text-muted italic">Database is empty. No appointments recorded.</td></tr>
                ) : (
                    appointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td className="p-4 font-bold text-primary flex items-center gap-2"><Clock size={16}/>{apt.date}</td>
                            <td className="p-4 font-bold">{apt.patient_name}</td>
                            <td className="p-4"><span className="badge" style={{background: 'var(--bg-main)', color: 'var(--primary)'}}>{apt.department}</span></td>
                            <td className="p-4"><span className="badge badge-warning">{apt.status || 'Pending'}</span></td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </motion.div>
    );
};

const CaseLogs = () => {
    const { token } = useAuth();  // Fix: get token from context, not broken prop
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({ patient_name: '', diagnosis: '', procedure: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => { fetchLogs(); }, []);

    const fetchLogs = () => {
        fetch('/api/case-logs', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setLogs(Array.isArray(data) ? data : []))
            .catch(err => { console.error(err); setLogs([]); });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/case-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });
        setFormData({ patient_name: '', diagnosis: '', procedure: '', date: new Date().toISOString().split('T')[0] });
        fetchLogs();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 p-2">
            <div className="border-b pb-4 border-[color:var(--border-color)]">
                <h2>Clinical Case Logs</h2>
                <p className="text-muted text-sm">Mandatory logging of all surgical and operative procedures.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col gap-4" style={{borderColor: 'var(--border-color)'}}>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" required value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="p-3 border rounded" />
                    <input type="text" placeholder="Patient Name" required value={formData.patient_name} onChange={e=>setFormData({...formData, patient_name: e.target.value})} className="p-3 border rounded" />
                </div>
                <input type="text" placeholder="Diagnosis" required value={formData.diagnosis} onChange={e=>setFormData({...formData, diagnosis: e.target.value})} className="p-3 border rounded" />
                <input type="text" placeholder="Operative Procedure Performed" required value={formData.procedure} onChange={e=>setFormData({...formData, procedure: e.target.value})} className="p-3 border rounded" />
                <button type="submit" className="btn btn-primary self-start">Log Case</button>
            </form>

            <div className="grid gap-4 mt-4">
                {logs.length === 0 ? <p className="text-muted italic">No case logs submitted yet.</p> : logs.map(l => (
                    <div key={l.id} className="p-5 border rounded bg-white shadow-sm" style={{borderColor: 'var(--border-color)', borderLeft: '4px solid var(--primary)'}}>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="m-0 text-primary">{l.patient_name}</h4>
                            <span className="text-sm font-bold text-muted">{l.date}</span>
                        </div>
                        <p className="m-0 text-sm"><strong className="text-secondary">Diagnosis:</strong> {l.diagnosis}</p>
                        <p className="m-0 text-sm mt-1"><strong className="text-secondary">Procedure:</strong> {l.procedure}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const DutyRoster = () => {
    const [schedules, setSchedules] = useState([]);
    useEffect(() => { 
        fetch('/api/schedules')
            .then(r=>r.json())
            .then(data => setSchedules(Array.isArray(data) ? data : []))
            .catch(() => setSchedules([])); 
    }, []);
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 p-2">
            <div className="border-b pb-4 border-[color:var(--border-color)]">
                <h2>Clinical Duty Roster</h2>
                <p className="text-muted text-sm">Emergency wards, night-shift duty bounds, and OPD postings.</p>
            </div>
            <div className="grid gap-4">
                {schedules.filter(s => s.type === 'CLINIC').map(s => (
                    <div key={s.id} className="p-5 border rounded bg-white flex flex-col gap-2 shadow-sm" style={{borderColor: 'var(--border-color)'}}>
                        <div className="flex items-center gap-2">
                            <span className="badge badge-success">{s.day}</span>
                            <span className="font-bold text-primary">{s.time_slot}</span>
                        </div>
                        <h4 className="m-0">{s.subject}</h4>
                        <span className="text-muted text-sm">{s.location}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const ResearchPapers = () => {
    const [mats, setMats] = useState([]);
    useEffect(() => { 
        fetch('/api/materials')
            .then(r=>r.json())
            .then(data => setMats(Array.isArray(data) ? data : []))
            .catch(() => setMats([])); 
    }, []);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 p-2">
            <div className="border-b pb-4 border-[color:var(--border-color)]">
                <h2>Research & Publications</h2>
                <p className="text-muted text-sm">Access academic journals, thesis templates, and reading lists.</p>
            </div>
            <div className="grid gap-4">
                {mats.map(m => (
                    <div key={m.id} className="p-5 border rounded bg-white shadow-sm flex items-center justify-between" style={{borderColor: 'var(--border-color)'}}>
                        <div>
                            <h4 className="m-0 text-primary">{m.title}</h4>
                            <span className="text-sm text-muted">{m.department}</span>
                        </div>
                        <span className="badge badge-warning">{m.type}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PgDashboard;
