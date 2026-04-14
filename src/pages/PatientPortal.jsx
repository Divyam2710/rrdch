import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MessageSquare, Activity, CheckCircle, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import DashboardLayout from '../components/DashboardLayout';

const PatientPortal = () => {
  const navLinks = [
      { heading: 'Services' },
      { id: 'book', icon: <CalendarIcon size={20} />, label: 'Book Appointment', path: '/patient-portal/book' },
      { id: 'track', icon: <Search size={20} />, label: 'Track Details', path: '/patient-portal/track' },
      { id: 'live', icon: <Activity size={20} />, label: 'Live Queue Status', path: '/patient-portal/live' },
      { heading: 'Post-Op' },
      { id: 'follow-up', icon: <MessageSquare size={20} />, label: 'Follow-up Form', path: '/patient-portal/follow-up' },
  ];

  return (
    <DashboardLayout 
        title="Patient Access" 
        subtitle="Secure Clinical Appointment Management" 
        navigationLinks={navLinks}
        accentColor="#0E7490"
    >
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em', fontWeight: '800' }}>Patient Portal</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px' }}>Skip the physical queue. Manage your clinical visits, track live wait times, and log follow-ups securely from your device.</p>
        </div>

        <div className="card shadow-md border-0" style={{ minHeight: '600px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
          <Routes>
            <Route path="/" element={<NavigateToBook />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="track" element={<TrackAppointment />} />
            <Route path="live" element={<LiveUpdates />} />
            <Route path="follow-up" element={<FollowUpForm />} />
          </Routes>
        </div>
    </DashboardLayout>
  );
};

const NavigateToBook = () => <Navigate to="/patient-portal/book" replace />;

// Sub-components
const BookAppointment = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patient_name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dept, setDept] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleBook = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patient_name, phone, department: dept, date: `${date} ${time}` })
        });
        const resData = await res.json();
        if(res.ok) {
            setBookingDetails({ id: resData.id, date: `${date} ${time}`, dept });
            setSubmitted(true);
        }
      } catch(err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  if(loading) return <Loader fullScreen message="Processing your booking request..." />;

  return submitted ? (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
      <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
      <h2 style={{ color: 'var(--success)', fontSize: '2.5rem' }}>Confirmed!</h2>
      <p className="text-lg mt-4 max-w-md mx-auto text-muted">Your appointment details are securely stored. Bring your phone to the reception on the day of the visit.</p>
      {bookingDetails && (
          <div className="mt-6 p-4 bg-white shadow-sm border rounded-lg max-w-xs mx-auto text-left text-sm" style={{borderColor: 'var(--border-color)'}}>
             <p className="mb-2"><strong className="text-primary">Appt ID:</strong> #{bookingDetails.id}</p>
             <p className="mb-2"><strong className="text-primary">Clinic:</strong> {bookingDetails.dept}</p>
             <p><strong className="text-primary">When:</strong> {bookingDetails.date}</p>
          </div>
      )}
      <button className="btn btn-outline mt-8" onClick={() => {setSubmitted(false); setDate(''); setTime(''); setDept(''); setBookingDetails(null);}}>Book Another Visit</button>
    </motion.div>
  ) : (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="border-b pb-4 mb-4" style={{borderBottom: '1px solid var(--border-color)'}}>
        <h2>Schedule Clinical Visit</h2>
        <p className="text-muted">No account required. Please fill accurate contact details.</p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleBook}>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-wide text-primary uppercase">Full Legal Name</label>
                <input type="text" required placeholder="John Doe" className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={patient_name} onChange={e=>setName(e.target.value)} />
            </div>
            
            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-wide text-primary uppercase">Phone Number</label>
                <input type="tel" required placeholder="10-digit mobile" className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-wide text-primary uppercase">Department Area</label>
                <select required className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={dept} onChange={e=>setDept(e.target.value)}>
                    <option value="">-- Choose Clinic --</option>
                    <option value="Oral Medicine & Radiology">Oral Medicine & Radiology</option>
                    <option value="Prosthodontics">Prosthodontics Clinic</option>
                    <option value="Oral Surgery">Maxillofacial / Oral Surgery</option>
                    <option value="Orthodontics">Orthodontics & Braces</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-wide text-primary uppercase">Date of Visit</label>
                <input type="date" required className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={date} onChange={e=>setDate(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-wide text-primary uppercase">Time Slot</label>
                <select required className="p-4 bg-main" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={time} onChange={e=>setTime(e.target.value)}>
                    <option value="">-- Choose Time --</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                </select>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t" style={{borderTop: '1px solid var(--border-color)'}}>
            <button type="submit" className="btn btn-primary py-4 px-8 w-full text-lg shadow-md hover:shadow-lg">
                Finalize Secure Booking
            </button>
        </div>
      </form>
    </motion.div>
  );
};

const TrackAppointment = () => {
  const [appointments, setAppointments] = useState(null);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  
  const handleSearch = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const res = await fetch(`/api/appointments?phone=${searchPhone}&id=${searchId}`);
          if(!res.ok) throw new Error((await res.json()).error);
          const data = await res.json();
          setAppointments(data);
      } catch(err) {
          alert('Error: ' + err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleCancel = async (id) => {
      if(!window.confirm('Are you sure you want to cancel this appointment?')) return;
      setCancelLoading(true);
      try {
          const res = await fetch(`/api/appointments/${id}/cancel`, {
             method: 'PUT',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ phone: searchPhone })
          });
          if(res.ok) {
              setAppointments(appointments.map(a => a.id === id ? {...a, status: 'Cancelled'} : a));
          } else {
              alert((await res.json()).error);
          }
      } catch(e) {
          alert('Failed to cancel');
      }
      setCancelLoading(false);
  };

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="border-b pb-4 mb-4" style={{borderBottom: '1px solid var(--border-color)'}}>
            <h2>Track Booking Status</h2>
            <p className="text-muted">Enter your Phone Number and Appointment ID to track or cancel your booking.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
            <input type="tel" required placeholder="Phone Number..." className="p-4 bg-main flex-grow" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', minWidth: '200px' }} value={searchPhone} onChange={e=>setSearchPhone(e.target.value)} />
            <input type="number" required placeholder="Appt ID (e.g. 5)" className="p-4 bg-main w-32" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} value={searchId} onChange={e=>setSearchId(e.target.value)} />
            <button type="submit" className="btn btn-secondary px-8">
                {loading ? <Loader /> : <><Search size={20} /> Fetch Data</>}
            </button>
        </form>

        <div className="mt-8">
            {appointments === null ? (
                <div className="p-12 text-center text-muted italic" style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    Your appointment details will appear here.
                </div>
            ) : appointments.length === 0 ? (
                <div className="p-8 text-center text-danger font-bold bg-red-50 rounded border-red-200 border">
                   No appointments found for {searchPhone}.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {appointments.map(apt => (
                        <div key={apt.id} className="p-6 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow" style={{ border: '1px solid var(--border-color)', borderLeft: '6px solid var(--primary)', borderRadius: 'var(--radius-md)' }}>
                            <div className="flex flex-col gap-1">
                                <div className="text-2xl font-bold text-primary">{apt.department}</div>
                                <div className="text-muted font-medium flex items-center gap-2">
                                    <User size={16} /> {apt.patient_name} &nbsp;|&nbsp; <CalendarIcon size={16} /> {apt.date}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`badge ${apt.status === 'Cancelled' ? 'bg-red-100 text-red-700 font-bold' : 'badge-warning'}`} style={{fontSize: '1rem', padding: '0.4rem 1rem'}}>{apt.status}</span>
                                <span className="text-xs text-muted">ID: APT-{apt.id.toString().padStart(4, '0')}</span>
                                {apt.status === 'Scheduled' && (
                                   <button onClick={() => handleCancel(apt.id)} disabled={cancelLoading} className="text-red-600 font-medium text-sm underline mt-2 hover:text-red-800">
                                     {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
                                   </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </motion.div>
  );
};

const LiveUpdates = () => {
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => { 
        const fetchQueue = () => {
            fetch('/api/queue')
                .then(res => res.json())
                .then(data => { setQueues(data); setLoading(false); })
                .catch(err => { console.error(err); setLoading(false); });
        };
        fetchQueue();
        const interval = setInterval(fetchQueue, 30000);
        return () => clearInterval(interval);
    }, []);

    if(loading) return <Loader message="Connecting to hospital sensors..." />;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4 border-[color:var(--border-color)]">
          <div>
              <h2>Live OPD Queue</h2>
              <p className="text-muted">Real-time status of current serving token numbers across clinical departments.</p>
          </div>
          <span className="badge flex items-center gap-2 py-2 px-4 shadow-sm" style={{background: 'var(--success)', color: 'white'}}>
            <div className="animate-pulse" style={{ width: 10, height: 10, background: 'white', borderRadius: '50%' }}></div> LIVE SYNC
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-4">
          {queues.length === 0 ? (
             <div className="col-span-2 p-8 text-center text-muted italic border-2 border-dashed rounded-lg">No active queue data transmitted.</div>
          ) : queues.map((d, i) => (
            <div key={i} className="p-6 bg-white shadow-md hover:-translate-y-1 transition-transform" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', borderTop: '4px solid var(--secondary)' }}>
              <h4 className="text-lg text-primary mb-4">{d.department}</h4>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-xs text-muted uppercase font-bold tracking-wider">Now Serving</span>
                    <strong style={{ fontSize: '2.5rem', color: 'var(--text-main)', lineHeight: '1' }}>{d.serving_number}</strong>
                </div>
                <span className="flex items-center gap-1 font-bold" style={{color: 'var(--accent)'}}><Clock size={16} /> Est. Wait: {d.est_wait_mins} mins</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
};

const FollowUpForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.target);
            const res = await fetch('/api/follow-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.get('phone'),
                    description: formData.get('description'),
                    urgent: formData.get('urgent') === 'on'
                })
            });
            if (res.ok) setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    if(loading) return <Loader message="Encrypting and transmitting feedback..." />;
    
    return submitted ? (
        <div className="text-center py-20 text-success">
            <CheckCircle size={64} style={{ margin: '0 auto 1.5rem' }} />
            <h3 className="text-2xl">Clinical Log Saved</h3>
            <p className="text-lg text-muted mt-2">Thank you. The surgical team will review your post-op condition.</p>
        </div>
    ) : (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
        <div className="border-b pb-4 mb-4 border-[color:var(--border-color)]">
            <h2>Post-Procedure Follow-up</h2>
            <p className="text-muted">Check-in with us 24 hours after surgery or major clinical procedures.</p>
        </div>
        
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input type="text" name="phone" placeholder="Patient Phone Number" required className="p-4" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} />
          <textarea name="description" rows="6" placeholder="Describe any pain, swelling, or concerns... (e.g., The extraction site is bleeding slightly)" required className="p-4" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}></textarea>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="urgent" name="urgent" /> <label htmlFor="urgent" className="text-danger font-bold">Mark as Urgent Medical Concern</label>
          </div>
          <button type="submit" className="btn btn-secondary py-4 px-8 mt-4 self-start shadow-md text-lg">Transmit Securely</button>
        </form>
      </motion.div>
    );
}

export default PatientPortal;
