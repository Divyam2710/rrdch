import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, Scale, CheckSquare, Mail, Phone, ExternalLink } from 'lucide-react';

const committeeData = [
  {
    key: 'anti-ragging', label: 'Anti-Ragging', icon: <ShieldAlert size={20} />, color: '#b91c1c',
    bg: '#FEF2F2', title: 'Anti-Ragging Squad',
    desc: 'RRDCH observes a zero-tolerance policy towards ragging in any form. The Anti-Ragging Committee constantly monitors campus premises, hostels, and canteens ensuring a completely secure environment for all fresher students.',
    details: [
      { label: 'National Helpline', value: '1800-180-5522' },
      { label: 'Campus Nodal Officer', value: '+91-80-2843-7150' },
      { label: 'Registered Under', value: 'UGC Regulations 2009' },
      { label: 'Category', value: 'Statutory & Mandatory' },
    ],
                    action: { label: 'Report Incident Confidentially', icon: <Mail size={16} />, href: 'mailto:antiragging@rrdch.org?subject=Confidential%20Ragging%20Incident%20Report' }
  },
  {
    key: 'ethics', label: 'Ethics Committee', icon: <Scale size={20} />, color: '#4f46e5',
    bg: '#EEF2FF', title: 'Institutional Ethics Committee (IEC)',
    desc: 'The IEC reviews and approves all clinical research and postgraduate dissertation protocols to ensure the safety, rights, and well-being of human research subjects, adhering to the highest ethical standards.',
    details: [
      { label: 'Registration', value: 'CDSCO / DHR Recognized' },
      { label: 'Meetings', value: 'Monthly (1st Tuesday)' },
      { label: 'Scope', value: 'Clinical & Research Trials' },
      { label: 'Compliance', value: 'ICH-GCP & Helsinki Declaration' },
    ],
    action: { label: 'Submit PG Protocol via Portal', icon: <ExternalLink size={16} />, href: '/pg-dashboard' }
  },
  {
    key: 'iqac', label: 'IQAC Cell', icon: <CheckSquare size={20} />, color: '#15803d',
    bg: '#F0FDF4', title: 'Internal Quality Assurance Cell',
    desc: 'The IQAC guarantees incremental improvement in academic and administrative performance. It oversees preparations for NAAC accreditations, internal academic audits, and outcome-based education (OBE) frameworks.',
    details: [
      { label: 'Accreditation', value: 'NAAC "A+" Framework' },
      { label: 'Focus', value: 'Outcome-Based Education' },
      { label: 'Meeting Frequency', value: 'Quarterly Reviews' },
      { label: 'Current Grade', value: 'A+ (Highest Band)' },
    ],
    action: { label: 'Download AQAR Annual Reports', icon: <ExternalLink size={16} />, href: 'https://www.rrdch.org' }
  },
];

const Committees = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('anti-ragging');

  useEffect(() => {
    if (location.state && location.state.tab) setActiveTab(location.state.tab);
  }, [location]);

  const active = committeeData.find(c => c.key === activeTab);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', border: '1px solid rgba(188,163,127,0.3)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Regulatory Compliance</span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Statutory <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Committees</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              RRDCH adheres strictly to regulatory mandates. Our committees ensure a safe, ethical, and high-quality environment for all students and patients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Nav */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: '5rem', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {committeeData.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.1rem 2rem',
                fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? tab.color : 'var(--text-muted)',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.key ? `3px solid ${tab.color}` : '3px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontSize: '0.95rem'
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-main">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {active && (
              <motion.div key={active.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                  {/* Header */}
                  <div style={{ padding: '2.5rem', background: active.bg, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'white', color: active.color, boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                      {React.cloneElement(active.icon, { size: 32 })}
                    </div>
                    <div>
                      <h2 className="text-primary" style={{ fontSize: '1.75rem', margin: '0 0 0.5rem' }}>{active.title}</h2>
                      <p className="text-muted" style={{ margin: 0, lineHeight: 1.7, fontSize: '1rem' }}>{active.desc}</p>
                    </div>
                  </div>
                  {/* Details grid */}
                  <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    {active.details.map((d, i) => (
                      <div key={i} style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>{d.label}</div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{d.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Action */}
                  <div style={{ padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <a href={active.action.href || '#'} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: active.color, textDecoration: 'none' }}>
                      {active.action.icon} {active.action.label}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
};

export default Committees;
