import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const info = [
    { icon: <MapPin size={22} />, label: 'Location', value: 'No.14, Ramohalli Cross, Kumbalgodu,\nMysore Road, Bangalore - 560074' },
    { icon: <Phone size={22} />, label: 'Phone', value: '+91-80-2843 7150\n+91-80-2843 7468' },
    { icon: <Mail size={22} />, label: 'Email', value: 'principalrrdch@gmail.com' },
    { icon: <Clock size={22} />, label: 'OPD Timings', value: 'Mon–Sat: 9:00 AM – 4:00 PM\nSundays: Closed' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Get In <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>We would love to hear from you. Reach out for appointments, admissions, or general inquiries.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-main">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Form */}
          <motion.div className="card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-primary mb-6" style={{ fontSize: '1.75rem' }}>Send a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="contact-name">Full Name</label>
                <input type="text" id="contact-name" placeholder="Dr. / Mr. / Ms." required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label htmlFor="contact-email">Email Address</label>
                <input type="email" id="contact-email" placeholder="you@example.com" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label htmlFor="contact-msg">Your Message</label>
                <textarea id="contact-msg" rows="5" placeholder="How can we help you?" required
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              {status === 'success' && <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18}/> Message sent successfully!</p>}
              {status === 'error' && <p style={{ color: 'var(--danger)' }}>Failed to send. Please call us directly.</p>}
              <button type="submit" disabled={status === 'sending'} className="btn btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={16} /> {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Info Cards */}
          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {info.map((item, i) => (
              <motion.div key={i} whileHover={{ x: 5 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem', background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ padding: '0.6rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', color: 'var(--secondary)', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
