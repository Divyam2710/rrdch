import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const typeColors = {
  Academic: { bg: '#EEF2FF', text: '#4F46E5', border: '#4F46E5' },
  Clinical: { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
  Hospital: { bg: '#F0FDF4', text: '#15803D', border: '#15803D' },
  Seminar: { bg: '#FFF7ED', text: '#C2410C', border: '#C2410C' },
  Sports: { bg: '#FEF9C3', text: '#92400E', border: '#D97706' },
  Cultural: { bg: '#FDF4FF', text: '#7E22CE', border: '#9333EA' },
  Exam: { bg: '#FEF2F2', text: '#991B1B', border: '#EF4444' },
};

const CalendarOfEvents = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => { setAllEvents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const types = ['All', ...new Set(allEvents.map(e => e.type))];
  const filtered = filter === 'All' ? allEvents : allEvents.filter(e => e.type === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Event <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Calendar</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto' }}>
              Stay updated with academic seminars, hospital outreach camps, and campus activities at RRDCH.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-main">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{
                  padding: '0.5rem 1.5rem', borderRadius: '999px', border: `2px solid ${filter === t ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: filter === t ? 'var(--primary)' : 'white',
                  color: filter === t ? 'white' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading && <p className="text-center text-muted py-8">Loading events...</p>}

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-color)' }}>
                <CalendarIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  {filter === 'All' ? 'No Events Yet' : `No ${filter} Events`}
                </h3>
                <p className="text-muted text-sm">Events added by the admin will appear here.</p>
              </div>
            )}

            {filtered.map((evt, i) => {
              const c = typeColors[evt.type] || typeColors.Academic;
              // Parse date for display
              const d = evt.event_date ? new Date(evt.event_date + 'T00:00:00') : null;
              const day = d ? String(d.getDate()).padStart(2, '0') : evt.date || '—';
              const month = evt.month || (d ? d.toLocaleString('en', { month: 'short' }) : '');
              const year = evt.year || (d ? d.getFullYear() : '');
              return (
                <motion.div key={evt.id || i}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  style={{ display: 'flex', background: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                  {/* Date badge */}
                  <div style={{ background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1.75rem', minWidth: '100px', flexShrink: 0 }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1, color: 'var(--secondary)' }}>{day}</span>
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{month}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{year}</span>
                  </div>
                  {/* Content */}
                  <div style={{ padding: '1.25rem 1.5rem', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>{evt.title}</h3>
                      <span style={{ padding: '0.2rem 0.75rem', borderRadius: '999px', background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                        {evt.type}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <Clock size={14} /> {evt.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <MapPin size={14} /> {evt.location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CalendarOfEvents;
