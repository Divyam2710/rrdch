import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, PlusCircle, Database, Calendar, AlertCircle, BookOpen, Trash2, Download, Image as ImageIcon, GraduationCap, Upload, CheckCircle, Server } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import DashboardLayout from '../components/DashboardLayout';
import LiveQueueControl from '../components/LiveQueueControl';
import SkeletonLoader from '../components/SkeletonLoader';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  const navLinks = [
      { heading: 'Data Core' },
      { id: 'overview', icon: <Database size={18} />, label: 'System Overview', path: '/admin/overview' },
      { id: 'appointments', icon: <Calendar size={18} />, label: 'All Appointments', path: '/admin/appointments' },
      { id: 'complaints', icon: <AlertCircle size={18} />, label: 'Hostel Complaints', path: '/admin/complaints' },
      { heading: 'Access Control' },
      { id: 'users', icon: <Users size={18} />, label: 'Create Credentials', path: '/admin/users' },
      { heading: 'Academic CMS' },

      { id: 'gallery', icon: <ImageIcon size={18} />, label: 'Gallery Management', path: '/admin/gallery' },
      { id: 'manage-events', icon: <Calendar size={18} />, label: 'Manage Events', path: '/admin/manage-events' },
      { id: 'manage-faculty', icon: <GraduationCap size={18} />, label: 'Manage Faculty', path: '/admin/manage-faculty' },
      { heading: 'Clinical Operations' },
      { id: 'pg-live', icon: <Activity size={18} />, label: 'PG Patient Board', path: '/admin/pg-live' },
  ];

  return (
    <DashboardLayout 
        title="Admin Control" 
        subtitle="RRDCH Master Operations" 
        navigationLinks={navLinks}
        accentColor="#991B1B"
    >
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Control Panel</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage hospital queues, appointments, and users.</p>
            </div>
            <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.375rem', fontWeight: 'bold' }}>Secure Logout</button>
        </div>

        <Routes>
            <Route path="/" element={<NavigateToOverview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="appointments" element={<AllAppointments />} />
            <Route path="complaints" element={<AllComplaints />} />
            <Route path="users" element={<UserManagement />} />


            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="pg-live" element={<PgPatientBoard />} />
            <Route path="manage-events" element={<ManageEvents />} />
            <Route path="manage-faculty" element={<ManageFaculty />} />
        </Routes>
    </DashboardLayout>
  );
};

const NavigateToOverview = () => <Navigate to="/admin/overview" replace />;

const Overview = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({ appointments: 0, complaints: 0 });
    const [chartData, setChartData] = useState([]);
    const [fullData, setFullData] = useState([]);
    const [sysStatus, setSysStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/appointments', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
            fetch('/api/complaints', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
            fetch('/api/admin/system-status', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        ]).then(([apts, comps, sys]) => {
            setStats({ appointments: apts.length || 0, complaints: comps.length || 0 });
            setFullData(apts);
            setSysStatus(sys);
            const counts = {};
            apts.forEach(a => counts[a.date] = (counts[a.date] || 0) + 1);
            let cData = Object.keys(counts).map(k => ({ name: k, Appointments: counts[k] }));
            if (cData.length === 0) cData = [{ name: 'Today', Appointments: 0 }];
            setChartData(cData.slice(-7));
            setLoading(false);
        }).catch(err => { console.error(err); setLoading(false); });
    }, [token]);

    const handleExportCSV = () => {
        const headers = ['ID,Patient,Phone,Department,Date,Status'];
        const rows = fullData.map(a => `${a.id},"${a.patient_name}",${a.phone},"${a.department}",${a.date},${a.status}`);
        const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_export_${new Date().getTime()}.csv`;
        a.click();
    };

    if(loading) return <Loader message="Fetching system analytics from SQLite..." />;

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
        <div>
            <h2>Data Analytics Dashboard</h2>
            <p className="text-muted text-sm">Real-time statistics covering SQLite database state.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 text-white" style={{ background: 'var(--primary)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 15px rgba(43,58,49,0.2)' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>{stats.appointments}</h3>
            <p className="opacity-80">Appointments Logged</p>
          </div>
          <div className="p-6 text-white" style={{ background: 'var(--secondary)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 15px rgba(188,163,127,0.2)' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem' }}>{stats.complaints}</h3>
            <p className="opacity-80">Active Complaints</p>
          </div>
          <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #678E75, #4A5D52)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 15px rgba(103,142,117,0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>{sysStatus?.uptime || '—'}</h3>
            <p className="opacity-80">Server Uptime</p>
          </div>
        </div>
        
        <div className="mt-8 border p-6 bg-white shadow-sm rounded-lg" style={{borderColor: 'var(--border-color)'}}>
            <div className="flex justify-between items-center mb-6">
                <h3>Appointments Trend</h3>
                <button onClick={handleExportCSV} className="btn btn-outline flex items-center gap-2"><Download size={16}/> Export Full CSV Data</button>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="Appointments" stroke="var(--secondary)" strokeWidth={3} dot={{r:4}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {sysStatus && (
          <div className="mt-8 border p-6 bg-white shadow-sm rounded-lg" style={{borderColor: 'var(--border-color)'}}>
            <h3 className="mb-4 flex items-center gap-2"><Server size={20} /> Live System Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded flex justify-between"><span className="text-muted">Status</span><span className="font-bold text-success">● {sysStatus.status?.toUpperCase()}</span></div>
              <div className="p-3 bg-gray-50 rounded flex justify-between"><span className="text-muted">Uptime</span><span className="font-bold">{sysStatus.uptime}</span></div>
              <div className="p-3 bg-gray-50 rounded flex justify-between"><span className="text-muted">Node.js</span><span className="font-bold">{sysStatus.node_version}</span></div>
              <div className="p-3 bg-gray-50 rounded flex justify-between"><span className="text-muted">DB Tables</span><span className="font-bold">{sysStatus.tables?.length} tables active</span></div>
              <div className="p-3 bg-gray-50 rounded flex justify-between col-span-2"><span className="text-muted">Last Checked</span><span className="font-bold">{new Date(sysStatus.timestamp).toLocaleTimeString()}</span></div>
            </div>
          </div>
        )}
      </motion.div>
    );
};

const AllAppointments = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [pgList, setPgList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const loadData = () => {
        Promise.all([
            fetch('/api/appointments', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
            fetch('/api/pgs', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        ]).then(([apts, pgs]) => {
            setAppointments(Array.isArray(apts) ? apts : []);
            setPgList(Array.isArray(pgs) ? pgs : []);
            setLoading(false);
        }).catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { loadData(); }, [token]);

    const handleStatusChange = async (id, status) => {
        await fetch(`/api/appointments/${id}/status`, { method: 'PUT', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({status})});
        setAppointments(prev => prev.map(a => a.id === id ? {...a, status} : a));
    };

    const handleAssign = async (id, pg_id) => {
        await fetch(`/api/appointments/${id}/assign`, { method: 'PUT', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({pg_id: pg_id || null})});
        const pg = pgList.find(p => p.id === parseInt(pg_id));
        setAppointments(prev => prev.map(a => a.id === id ? {...a, pg_id: pg_id || null, pg_name: pg?.name || null} : a));
    };

    if(loading) return (
      <div className="flex flex-col gap-6">
         <SkeletonLoader type="text" count={2} />
         <SkeletonLoader type="list" count={4} />
      </div>
    );

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
              <h2>Master Clinical Schedule</h2>
              <p className="text-muted text-sm">Assign patients to PG doctors. All department walk-ins and bookings.</p>
          </div>
          <span className="badge badge-success flex items-center gap-2 px-3 py-2">
            <div style={{ width: 8, height: 8, background: '#05c46b', borderRadius: '50%' }}></div> Live Sync
          </span>
        </div>
    
        {pgList.length === 0 && (
          <div style={{ padding: '0.75rem 1rem', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', fontSize: '0.875rem', color: '#92400E' }}>
            ⚠️ No PG doctors found. Create PG credentials first in "Create Credentials" to enable patient assignment.
          </div>
        )}

        <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)', background: 'rgba(10,61,98,0.05)' }}>
                <th className="p-4 font-bold text-primary">Date</th>
                <th className="p-4 font-bold text-primary">Patient Name</th>
                <th className="p-4 font-bold text-primary">Contact</th>
                <th className="p-4 font-bold text-primary">Department</th>
                <th className="p-4 font-bold text-primary">Assign PG Doctor</th>
                <th className="p-4 font-bold text-primary">Status</th>
                </tr>
            </thead>
            <tbody>
                {appointments.length === 0 ? (
                    <tr><td colSpan="6" className="text-center p-8 text-muted italic">No appointments recorded.</td></tr>
                ) : (
                    appointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td className="p-4 font-bold">{apt.date}</td>
                            <td className="p-4">{apt.patient_name}</td>
                            <td className="p-4 text-muted">{apt.phone}</td>
                            <td className="p-4">{apt.department}</td>
                            <td className="p-4">
                                <select
                                    value={apt.pg_id || ''}
                                    onChange={e => handleAssign(apt.id, e.target.value)}
                                    className="border p-1 bg-white rounded text-sm outline-none w-full"
                                    style={{ borderColor: apt.pg_id ? '#B45309' : 'var(--border-color)', fontWeight: apt.pg_id ? 700 : 400 }}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {pgList.map(pg => (
                                        <option key={pg.id} value={pg.id}>{pg.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="p-4">
                                <select 
                                    value={apt.status}
                                    onChange={e => handleStatusChange(apt.id, e.target.value)}
                                    className="border p-1 bg-white rounded text-sm outline-none w-full"
                                >
                                    <option>Scheduled</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                    <option>No Show</option>
                                </select>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div>
              <h2>Doctor Live Availability</h2>
              <p className="text-muted text-sm">Update clinical status so patients in the waiting room know your availability.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <LiveQueueControl token={token} department="Oral Surgery" />
            <LiveQueueControl token={token} department="Orthodontics" />
            <LiveQueueControl token={token} department="Pedodontics" />
            <LiveQueueControl token={token} department="Prosthodontics" />
        </div>
      </motion.div>
    );
};

const AllComplaints = () => {
    const { token } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch('/api/complaints', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setComplaints(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [token]);

    if(loading) return (
      <div className="flex flex-col gap-6">
         <SkeletonLoader type="text" count={2} />
         <SkeletonLoader type="grid" count={4} />
      </div>
    );

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b pb-4" style={{borderBottom: '1px solid var(--border-color)'}}>
          <div>
              <h2>Hostel Complaints Log</h2>
              <p className="text-muted text-sm">Review safety, electrical, and facility issues raised by students.</p>
          </div>
        </div>
    
        <div className="grid gap-4 mt-4">
            {complaints.length === 0 ? (
                <div className="p-8 text-center text-muted italic border-dashed border-2" style={{borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)'}}>
                    No complaints registered in the system.
                </div>
            ) : (
                complaints.map(comp => (
                    <div key={comp.id} className={`p-5 flex flex-col gap-2 relative bg-white border border-gray-200 rounded-lg shadow-sm`} style={{ borderLeft: comp.status === 'Resolved' ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="badge" style={{background: 'var(--primary)', color: 'white'}}>{comp.category.toUpperCase()} issue</span>
                            <span className="text-sm font-bold text-muted">{new Date(comp.created_at).toLocaleDateString()}</span>
                            
                            {comp.status !== 'Resolved' ? (
                                <button onClick={async () => {
                                    await fetch(`/api/complaints/${comp.id}/status`, { method: 'PUT', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify({status: 'Resolved'})});
                                    setComplaints(complaints.map(c => c.id === comp.id ? {...c, status: 'Resolved'} : c));
                                }} className="btn btn-outline ml-auto text-xs py-1 px-3">Mark Resolved</button>
                            ) : (
                                <span className="badge badge-success ml-auto">Resolved</span>
                            )}
                        </div>
                        <h4 className="m-0 text-xl text-primary">Room: {comp.room_no}</h4>
                        <p className="text-muted m-0">{comp.description}</p>
                    </div>
                ))
            )}
        </div>
      </motion.div>
    );
};

const UserManagement = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'pg' });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        
        try {
            const res = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.error);
            setMsg('SECURE_SUCCESS');
            setFormData({ name: '', email: '', password: '', role: 'pg' });
        } catch (err) {
            setMsg('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="border-b pb-4" style={{borderBottom: '1px solid var(--border-color)'}}>
                <h2>Generate Secure Credentials</h2>
                <p className="text-muted text-sm">Issue login access to Clinical Doctors, Faculty, or co-Admins safely.</p>
            </div>
            
            {msg === 'SECURE_SUCCESS' && (
                <div className="p-4 mb-4 flex items-center gap-3 text-success" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)' }}>
                    <PlusCircle size={24} />
                    <strong>Account provisioned successfully.</strong> Credentials recorded in database.
                </div>
            )}
            {msg && msg !== 'SECURE_SUCCESS' && <div className="p-4 mb-4 text-danger" style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)' }}>{msg}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4 max-w-lg">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-primary tracking-wide uppercase">Institutional Name</label>
                    <input type="text" placeholder="Dr. Sharma / Admin Desk 1" required className="p-3" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-primary tracking-wide uppercase">Official Email</label>
                    <input type="email" placeholder="faculty@rrdch.org" required className="p-3" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-primary tracking-wide uppercase">Temporary Password</label>
                    <input type="text" placeholder="Generate secure password" required className="p-3" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-primary tracking-wide uppercase">Access Level (Role)</label>
                    <select required className="p-3" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'white' }}
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="pg">PG Doctor (Clinical Access)</option>
                        <option value="admin">System Admin (Full Access)</option>
                        <option value="student">Student (Dashboard Access)</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary mt-4 py-4 w-full flex justify-center gap-2 text-lg">
                    {loading ? <Loader /> : <><PlusCircle size={20} /> Authorize & Create Account</>}
                </button>
            </form>

            <ResetPasswordTable token={token} />
        </motion.div>
    );
};

const ResetPasswordTable = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [resetTarget, setResetTarget] = useState(null); // { id, name }
    const [newPassword, setNewPassword] = useState('');
    const [resetMsg, setResetMsg] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(r => r.json())
            .then(data => setUsers(Array.isArray(data) ? data : []))
            .catch(() => setUsers([]));
    }, [token]);

    const handleReset = async () => {
        if (!newPassword || newPassword.length < 8) return setResetMsg('error:Password must be at least 8 characters');
        setSaving(true);
        const res = await fetch(`/api/admin/reset-password/${resetTarget.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ newPassword })
        });
        setSaving(false);
        if (res.ok) {
            setResetMsg(`success:Password for ${resetTarget.name} has been reset.`);
            setResetTarget(null);
            setNewPassword('');
        } else {
            setResetMsg('error:Reset failed. Try again.');
        }
        setTimeout(() => setResetMsg(''), 5000);
    };

    return (
        <div className="mt-8 border-t pt-8" style={{borderColor: 'var(--border-color)'}}>
            <h2>Active Credentials Registry</h2>
            <p className="text-muted text-sm mb-4">Master list of all authorized personnel. Reset or revoke access below.</p>

            {resetMsg && (
              <div className={`p-4 mb-4 rounded-md font-medium text-sm ${resetMsg.startsWith('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {resetMsg.split(':')[1]}
              </div>
            )}

            {/* Inline Reset Modal */}
            {resetTarget && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Reset Password</h3>
                  <p className="text-muted text-sm mb-4">Setting new credentials for <strong>{resetTarget.name}</strong></p>
                  <input
                    type="text"
                    placeholder="Enter new password (min 8 chars)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="p-3 border rounded w-full mb-4"
                    style={{ border: '2px solid var(--border-color)' }}
                    autoFocus
                  />
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => { setResetTarget(null); setNewPassword(''); }} className="btn btn-outline">Cancel</button>
                    <button onClick={handleReset} disabled={saving} className="btn btn-primary">
                      {saving ? 'Saving...' : 'Confirm Reset'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr className="border-b" style={{borderColor: 'var(--border-color)'}}>
                        <th className="py-2">Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b" style={{borderColor: 'var(--border-color)'}}>
                            <td className="py-3 font-bold">{u.name}</td>
                            <td className="text-muted">{u.email}</td>
                            <td><span className="badge badge-success">{u.role}</span></td>
                            <td className="flex gap-2 py-3">
                                <button onClick={() => setResetTarget(u)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                    Reset Key
                                </button>
                                <button onClick={async () => {
                                    if(!window.confirm(`Delete ${u.name}? This is irreversible.`)) return;
                                    await fetch(`/api/users/${u.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
                                    setUsers(users.filter(user => user.id !== u.id));
                                }} className="btn btn-outline" style={{ padding: '0.4rem', borderColor: '#ef4444', color: '#ef4444' }}>
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const GalleryManagement = () => {
    const { token } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [mode, setMode] = useState('url'); // 'url' or 'upload'
    const [formData, setFormData] = useState({ url: '', caption: '', category: 'Campus' });
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const fileRef = useRef(null);

    const loadPhotos = () => fetch('/api/gallery').then(r => r.json()).then(d => setPhotos(Array.isArray(d) ? d : [])).catch(() => {});
    useEffect(() => { loadPhotos(); }, []);

    const handleUrlAdd = async (e) => {
        e.preventDefault();
        if (!formData.url) return;
        await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });
        setFormData({ url: '', caption: '', category: 'Campus' });
        loadPhotos();
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('image', uploadFile);
        try {
            const res = await fetch('/api/admin/upload-image', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            // Now save to gallery with the returned URL
            await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ url: `http://localhost:5000${data.url}`, caption: formData.caption, category: formData.category })
            });
            setUploadMsg('✓ Image uploaded and saved to gallery.');
            setUploadFile(null);
            if (fileRef.current) fileRef.current.value = '';
            loadPhotos();
        } catch (err) {
            setUploadMsg('Error: ' + err.message);
        } finally {
            setUploading(false);
            setTimeout(() => setUploadMsg(''), 4000);
        }
    };

    const handleDelete = (id) => {
        if(window.confirm('Remove this photo from public gallery?')) {
            fetch(`/api/admin/gallery/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }}).then(loadPhotos);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="border-b pb-4" style={{borderColor: 'var(--border-color)'}}>
                <h2>Public Gallery Control</h2>
                <p className="text-muted text-sm">Add or remove photos displayed on the public campus gallery page.</p>
            </div>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', background: '#F3F4F6', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                {['url', 'upload'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                        background: mode === m ? 'white' : 'transparent', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                        color: mode === m ? 'var(--primary)' : '#9CA3AF', textTransform: 'capitalize'
                    }}>{m === 'url' ? '🔗 Paste URL' : '📁 Upload File'}</button>
                ))}
            </div>

            {uploadMsg && <div style={{ padding: '0.75rem 1rem', background: uploadMsg.startsWith('Error') ? '#FEF2F2' : '#F0FDF4', color: uploadMsg.startsWith('Error') ? '#991B1B' : '#166534', borderRadius: '8px', fontSize: '0.875rem' }}>{uploadMsg}</div>}

            {mode === 'url' ? (
                <form onSubmit={handleUrlAdd} className="flex gap-4 bg-white p-6 rounded-lg shadow-sm border" style={{borderColor: 'var(--border-color)'}}>
                    <input type="url" placeholder="Image URL (e.g. Unsplash/Imgur link)" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="p-3 border rounded flex-grow" />
                    <input type="text" placeholder="Caption (Optional)" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} className="p-3 border rounded" />
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-3 border rounded w-32">
                        <option>Campus</option><option>Events</option><option>Clinic</option><option>Awards</option>
                    </select>
                    <button type="submit" className="btn btn-secondary flex items-center gap-2"><Upload size={16}/> Add Photo</button>
                </form>
            ) : (
                <form onSubmit={handleFileUpload} className="flex gap-4 bg-white p-6 rounded-lg shadow-sm border items-center" style={{borderColor: 'var(--border-color)'}}>
                    <input type="file" accept="image/*" ref={fileRef} onChange={e => setUploadFile(e.target.files[0])} required className="p-2 border rounded flex-grow" style={{border: '2px dashed var(--border-color)'}} />
                    <input type="text" placeholder="Caption (Optional)" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} className="p-3 border rounded" />
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-3 border rounded w-32">
                        <option>Campus</option><option>Events</option><option>Clinic</option><option>Awards</option>
                    </select>
                    <button type="submit" disabled={uploading} className="btn btn-primary flex items-center gap-2">
                        <Upload size={16}/> {uploading ? 'Uploading...' : 'Upload & Publish'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-3 gap-6">
                {photos.length === 0 && <div className="col-span-3 p-8 text-center text-muted italic border-dashed border-2 rounded-lg" style={{borderColor:'var(--border-color)'}}>No photos in gallery yet.</div>}
                {photos.map(p => (
                    <div key={p.id} className="relative group bg-white border rounded shadow-sm overflow-hidden" style={{borderColor: 'var(--border-color)'}}>
                        <img src={p.url} alt={p.caption} style={{ width: '100%', height: '200px', objectFit: 'cover' }} onError={e => { e.target.src = 'https://placehold.co/400x200?text=Image+Error'; }} />
                        <div className="p-3">
                            <h4 className="text-sm font-bold text-primary">{p.category}</h4>
                            <p className="text-xs text-muted truncate">{p.caption || 'No caption'}</p>
                        </div>
                        <button onClick={() => handleDelete(p.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- PG PATIENT BOARD: Appointments grouped by assigned PG doctor ---
const PgPatientBoard = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [pgList, setPgList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/appointments', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
            fetch('/api/pgs', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        ]).then(([apts, pgs]) => {
            setAppointments(Array.isArray(apts) ? apts : []);
            setPgList(Array.isArray(pgs) ? pgs : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [token]);

    if (loading) return <Loader message="Loading PG patient board..." />;

    const unassigned = appointments.filter(a => !a.pg_id);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div className="border-b pb-4" style={{borderColor: 'var(--border-color)'}}>
                <h2>PG Doctor Patient Board</h2>
                <p className="text-muted text-sm">All assigned patients grouped per PG doctor. Go to "All Appointments" to assign patients.</p>
            </div>

            {pgList.length === 0 && (
                <div className="p-6 text-center text-muted italic border-dashed border-2 rounded-lg" style={{borderColor:'var(--border-color)'}}>
                    No PG doctors registered. Create PG credentials first.
                </div>
            )}

            {pgList.map(pg => {
                const pgApts = appointments.filter(a => a.pg_id === pg.id);
                return (
                    <div key={pg.id} className="bg-white border rounded-lg shadow-sm overflow-hidden" style={{borderColor: 'var(--border-color)'}}>
                        <div className="p-4 flex justify-between items-center" style={{ background: '#FFFBEB', borderBottom: '1px solid var(--border-color)' }}>
                            <div>
                                <span className="font-bold text-amber-800">Dr. {pg.name}</span>
                                <span className="text-muted text-sm ml-2">({pg.email})</span>
                            </div>
                            <span className="badge" style={{ background: '#FEF3C7', color: '#92400E' }}>{pgApts.length} Patient{pgApts.length !== 1 ? 's' : ''}</span>
                        </div>
                        {pgApts.length === 0 ? (
                            <p className="p-4 text-muted italic text-sm">No patients assigned yet.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead><tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                                    <th className="p-3 text-sm text-primary">Patient</th>
                                    <th className="p-3 text-sm text-primary">Dept</th>
                                    <th className="p-3 text-sm text-primary">Date</th>
                                    <th className="p-3 text-sm text-primary">Status</th>
                                </tr></thead>
                                <tbody>
                                    {pgApts.map(a => (
                                        <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td className="p-3 font-medium">{a.patient_name}</td>
                                            <td className="p-3 text-muted text-sm">{a.department}</td>
                                            <td className="p-3 text-sm">{a.date}</td>
                                            <td className="p-3"><span className="badge badge-warning text-xs">{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            })}

            {unassigned.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#FECACA', borderLeft: '4px solid #EF4444' }}>
                    <div className="p-4" style={{ background: '#FEF2F2', borderBottom: '1px solid #FECACA' }}>
                        <span className="font-bold text-red-800">⚠ Unassigned Patients ({unassigned.length})</span>
                        <span className="text-red-600 text-sm ml-2">Go to All Appointments to assign a PG doctor</span>
                    </div>
                    {unassigned.map(a => (
                        <div key={a.id} className="p-3 border-b text-sm flex justify-between" style={{borderColor: '#FECACA'}}>
                            <span>{a.patient_name} — {a.department}</span>
                            <span className="text-muted">{a.date}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// --- MANAGE EVENTS ---
const ManageEvents = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({ title: '', event_date: '', time: '', location: '', type: 'Academic' });

    const load = () => fetch('/api/events').then(r => r.json()).then(d => setEvents(Array.isArray(d) ? d : [])).catch(() => {});
    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await fetch('/api/admin/events', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(form)
        });
        setForm({ title: '', event_date: '', time: '', location: '', type: 'Academic' });
        load();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div className="border-b pb-4" style={{borderColor: 'var(--border-color)'}}>
                <h2>Calendar of Events CMS</h2>
                <p className="text-muted text-sm">Add and manage events that appear on the public Calendar of Events page.</p>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm border" style={{borderColor:'var(--border-color)'}}>
                <input type="text" placeholder="Event Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="p-3 border rounded col-span-2" />
                <input type="date" required value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className="p-3 border rounded" />
                <input type="text" placeholder="Time (e.g. 10:00 AM)" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="p-3 border rounded" />
                <input type="text" placeholder="Location / Venue" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="p-3 border rounded" />
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="p-3 border rounded">
                    <option>Academic</option><option>Clinical</option><option>Sports</option><option>Cultural</option><option>Exam</option>
                </select>
                <button type="submit" className="btn btn-primary col-span-2 flex items-center justify-center gap-2"><CheckCircle size={18}/> Add to Calendar</button>
            </form>

            <div className="bg-white border rounded shadow-sm" style={{borderColor:'var(--border-color)'}}>
                {events.length === 0 && <p className="p-6 text-muted italic text-center">No events added yet.</p>}
                {events.map(ev => (
                    <div key={ev.id} className="flex justify-between items-center p-4 border-b" style={{borderColor:'var(--border-color)'}}>
                        <div>
                            <span className="badge badge-warning text-xs mr-2">{ev.type}</span>
                            <strong>{ev.title}</strong>
                            <span className="text-muted text-sm ml-2">| {ev.event_date} | {ev.time} | {ev.location}</span>
                        </div>
                        <button onClick={async () => { await fetch(`/api/admin/events/${ev.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); load(); }} className="text-danger hover:opacity-70"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- MANAGE FACULTY ---
const ManageFaculty = () => {
    const { token } = useAuth();
    const [faculty, setFaculty] = useState([]);
    const [form, setForm] = useState({ name: '', role: 'Professor', dept: '', specialty: '' });

    const load = () => fetch('/api/faculty').then(r => r.json()).then(d => setFaculty(Array.isArray(d) ? d : [])).catch(() => {});
    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await fetch('/api/admin/faculty', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(form)
        });
        setForm({ name: '', role: 'Professor', dept: '', specialty: '' });
        load();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div className="border-b pb-4" style={{borderColor:'var(--border-color)'}}>
                <h2>Faculty Directory CMS</h2>
                <p className="text-muted text-sm">Manage faculty profiles shown on the public Faculty & Doctors page.</p>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm border" style={{borderColor:'var(--border-color)'}}>
                <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 border rounded" />
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="p-3 border rounded">
                    <option>Professor</option><option>Associate Professor</option><option>Assistant Professor</option><option>HOD</option><option>Reader</option>
                </select>
                <input type="text" placeholder="Department" required value={form.dept} onChange={e => setForm({...form, dept: e.target.value})} className="p-3 border rounded" />
                <input type="text" placeholder="Specialty (Optional)" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} className="p-3 border rounded" />
                <button type="submit" className="btn btn-primary col-span-2 flex items-center justify-center gap-2"><GraduationCap size={18}/> Add Faculty Member</button>
            </form>

            <div className="bg-white border rounded shadow-sm" style={{borderColor:'var(--border-color)'}}>
                {faculty.length === 0 && <p className="p-6 text-muted italic text-center">No faculty added yet.</p>}
                {faculty.map(f => (
                    <div key={f.id} className="flex justify-between items-center p-4 border-b" style={{borderColor:'var(--border-color)'}}>
                        <div>
                            <strong>{f.name}</strong>
                            <span className="text-muted text-sm ml-2">— {f.role} | {f.dept}</span>
                            {f.specialty && <span className="text-xs text-muted ml-2">({f.specialty})</span>}
                        </div>
                        <button onClick={async () => { await fetch(`/api/admin/faculty/${f.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); load(); }} className="text-danger hover:opacity-70"><Trash2 size={18}/></button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
