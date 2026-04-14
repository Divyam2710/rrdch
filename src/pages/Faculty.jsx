import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap } from 'lucide-react';

const avatarColors = ['#2B3A31', '#BCA37F', '#4A5D52', '#8B6914', '#3D5A80', '#7D4E57'];

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faculty')
      .then(r => r.json())
      .then(data => { setFaculty(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group by department
  const byDept = faculty.reduce((acc, f) => {
    if (!acc[f.dept]) acc[f.dept] = [];
    acc[f.dept].push(f);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', border: '1px solid rgba(188,163,127,0.3)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Academic Leaders</span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Faculty <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Directory</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto' }}>
              Meet our distinguished faculty of internationally trained specialists and award-winning clinicians.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-main">
        <div className="container">
          {loading && <p className="text-center text-muted">Loading faculty directory...</p>}

          {!loading && faculty.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Faculty Directory Coming Soon</h2>
              <p className="text-muted">The admin is yet to add faculty profiles. Check back soon.</p>
            </div>
          )}

          {Object.entries(byDept).map(([dept, members], dIdx) => (
            <div key={dept} style={{ marginBottom: '3rem' }}>
              <h2 style={{ color: 'var(--primary)', borderBottom: '2px solid var(--secondary)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>{dept}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="card flex items-start gap-4 hover:shadow-lg transition-shadow">
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatarColors[(dIdx + i) % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontSize: '1.3rem', fontWeight: 700 }}>
                      {f.name.charAt(f.name.indexOf(' ') + 1) || f.name[0]}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{f.name}</h3>
                      <span style={{ fontSize: '0.8rem', background: 'var(--bg-main)', color: 'var(--secondary)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{f.role}</span>
                      {f.specialty && <p className="text-muted text-sm mt-2">{f.specialty}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Faculty;
