import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, GraduationCap, Award, BookOpen, ChevronRight, Send, ArrowRight } from 'lucide-react';

const ApplicationForm = ({ type, color }) => {
  const [formData, setFormData] = React.useState({ name: '', phone: '', email: '', neet_score: '', type });
  const [status, setStatus] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    fetch('/api/applications', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    }).then(r => r.json()).then(data => {
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', neet_score: '', type });
    }).catch(() => setStatus('error'));
  };

  if (status === 'success') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{ padding: '2.5rem', textAlign: 'center', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
      <CheckCircle size={48} color="#15803D" style={{ margin: '0 auto 1rem' }} />
      <h3 style={{ color: '#15803D', margin: '0 0 0.5rem' }}>Application Submitted!</h3>
      <p style={{ color: '#166534', margin: 0, fontSize: '0.95rem' }}>Our admissions team will contact you within 24 hours.</p>
      <button onClick={() => setStatus('')} className="btn btn-outline" style={{ marginTop: '1.5rem', borderColor: '#15803D', color: '#15803D' }}>Submit Another</button>
    </motion.div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="text" placeholder="Full Name (as per records)" required value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input type="tel" placeholder="Phone Number" required value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ flex: 1 }} />
        <input type="email" placeholder="Email Address" required value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ flex: 1 }} />
      </div>
      <input type="number" placeholder={`${type === 'BDS' ? 'NEET UG' : 'NEET MDS'} Score (optional)`} value={formData.neet_score}
        onChange={e => setFormData({ ...formData, neet_score: e.target.value })} />
      <button type="submit" disabled={status === 'sending'}
        className="btn"
        style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1rem', fontWeight: 700, width: '100%', background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)' }}>
        <Send size={16} /> {status === 'sending' ? 'Submitting...' : `Submit ${type} Application`}
      </button>
      {status === 'error' && <p style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>Submission failed. Please try calling us directly.</p>}
    </form>
  );
};

const steps = [
  { label: 'Check Eligibility', desc: 'NEET qualification required' },
  { label: 'Apply Online', desc: 'Via KEA / MCC portal' },
  { label: 'Document Verification', desc: 'Attend document round' },
  { label: 'Seat Allotment', desc: 'Counselling & fee payment' },
  { label: 'Report to Campus', desc: 'Join orientation' },
];

const programs = [
  {
    type: 'BDS', icon: <GraduationCap size={28} />, color: '#2B3A31',
    title: 'Bachelor of Dental Surgery',
    desc: 'A comprehensive 5-year program (4 years + 1-year internship) preparing students for a distinguished career in clinical dental surgery.',
    features: ['100 Annual Seats', '4 Years + 1 Year Internship', '10+2 PCB + NEET UG Required', 'DCI & RGUHS Approved'],
  },
  {
    type: 'MDS', icon: <Award size={28} />, color: '#BCA37F',
    title: 'Master of Dental Surgery',
    desc: 'A rigorous 3-year postgraduate specialization program across 8 clinical departments, combining advanced research with intensive clinical training.',
    features: ['8 Specializations Available', '3-Year Duration', 'BDS Degree + NEET MDS', 'Dissertation & Research Mandatory'],
  },
];

const Admissions = () => {
  const [activeProgram, setActiveProgram] = useState('BDS');
  const active = programs.find(p => p.type === activeProgram);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '5rem 0 4rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(188,163,127,0.25) 0%, transparent 60%)' }}></div>
        <div className="container relative" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ maxWidth: '640px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', border: '1px solid rgba(188,163,127,0.3)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>2026–27 Admissions Open</span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 1.08, marginBottom: '1.25rem' }}>
              Begin Your Journey in <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dentistry</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px' }}>
              Join NAAC A+ accredited Rajarajeswari Dental College and start your path to becoming a world-class dental professional.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#apply" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.9rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Apply Now <ArrowRight size={16} />
              </a>
              <a href="tel:+918028437150" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2rem', color: 'white', borderColor: 'white' }}>
                Call Admissions Office
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admission Steps */}
      <div style={{ background: 'var(--bg-dark)', borderBottom: '3px solid var(--secondary)' }}>
        <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto' }}>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', textAlign: 'center', minWidth: '120px', padding: '0 0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>{i + 1}</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{step.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem' }}>{step.desc}</div>
              </div>
              {i < steps.length - 1 && <ChevronRight size={20} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Program Section */}
      <section id="apply" className="py-16 bg-main">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="text-primary" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>Choose Your Program</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {programs.map(p => (
                <button key={p.type} onClick={() => setActiveProgram(p.type)}
                  className={`btn ${activeProgram === p.type ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '1rem', minWidth: '160px' }}>
                  {p.icon} {p.type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Program Info */}
            <motion.div key={active.type} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '1.5rem' }}>
                <div style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}AA)`, padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'white', opacity: 0.8 }}>{active.icon}</div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Program</div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>{active.title}</h2>
                  </div>
                </div>
                <div style={{ padding: '2rem', background: 'white' }}>
                  <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>{active.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {active.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-main)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Application Form */}
            <motion.div key={active.type + '-form'} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              className="card" style={{ position: 'sticky', top: '6rem' }}>
              <h3 className="text-primary" style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>Request a Callback</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill in your details and our admissions counsellor will contact you within 24 hours.</p>
              <ApplicationForm type={active.type} color={active.color} />
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Admissions;
