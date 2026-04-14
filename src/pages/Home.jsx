import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowRight, Video, Map, CheckCircle, ChevronRight, Phone, Clock, MapPin, Stethoscope, GraduationCap, Users, Award, Shield, Microscope, Scan, Layers, Heart, Baby, Scissors, Activity, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';

const DEPARTMENTS = [
  { name: 'Orthodontics', icon: <Layers size={22} />, desc: 'Invisible aligners & braces' },
  { name: 'Oral Surgery', icon: <Scissors size={22} />, desc: 'Complex extractions & jaw surgery' },
  { name: 'Implantology', icon: <Stethoscope size={22} />, desc: 'Immediate-load & zygomatic implants' },
  { name: 'Prosthodontics', icon: <Shield size={22} />, desc: 'Crown, bridge & full-mouth rehab' },
  { name: 'Periodontology', icon: <Heart size={22} />, desc: 'Laser gum therapy & bone grafting' },
  { name: 'Pedodontics', icon: <Baby size={22} />, desc: 'Gentle dental care for children' },
  { name: 'Oral Radiology', icon: <Scan size={22} />, desc: 'CBCT, OPG & advanced imaging' },
  { name: 'Oral Pathology', icon: <Microscope size={22} />, desc: 'Tissue diagnostics & biopsies' },
  { name: 'Conservative Dentistry', icon: <Activity size={22} />, desc: 'Restorations, root canals & endodontics' },
  { name: 'Public Health Dentistry', icon: <Globe size={22} />, desc: 'Community dental camps & outreach' },
];

const TESTIMONIALS = [
  { name: 'Rajesh K.', role: 'OPD Patient', quote: 'The maxillofacial surgery department provided incredible care. Facilities are undeniably world-class. Highly recommend RRDCH to anyone in Bangalore.' },
  { name: 'Dr. Sneha Rao', role: 'MDS Resident', quote: 'As a PG student, the volume of clinical exposure we get daily is unmatched. It truly prepares you for a high-caliber dental career.' },
  { name: 'Anita V.', role: 'Orthodontics Patient', quote: 'The new patient portal to track my appointment queue live saved me hours of waiting. Brilliant technology paired with brilliant doctors.' },
];

// A clean, neutral campus exterior image without text overlays
const HERO_IMAGE = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop';

const Home = () => {
  const { t } = useLanguage();
  const [activeTour, setActiveTour] = useState('campus');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const i = setInterval(() => setTestimonialIdx(p => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => setEvents(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => { });
  }, []);

  return (
    <main>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        aria-label="Welcome to Rajarajeswari Dental College and Hospital"
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}
      >
        <img
          src={HERO_IMAGE}
          alt="Modern dental clinic — Rajarajeswari Dental College and Hospital, Bangalore"
          className="hero-ken-burns"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          loading="eager"
          fetchpriority="high"
        />
        {/* Dark gradient left-to-right — text stays on left, image visible on right */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(17,24,19,0.95) 0%, rgba(30,42,35,0.88) 42%, rgba(43,58,49,0.45) 72%, transparent 100%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '7rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: '660px' }}>

            {/* Trust pill */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(188,163,127,0.12)', border: '1px solid rgba(188,163,127,0.35)', color: '#E0CEAA', borderRadius: '4px', padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
                <Shield size={12} style={{ color: '#BCA37F' }} /> NAAC A+ Accredited&ensp;|&ensp;Est. 1994&ensp;|&ensp;DCI Approved
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3 }}
              style={{ color: 'white', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}
            >
              Bangalore's Premier<br />
              <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Dental College
              </span>{' '}
              &amp; Hospital
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '540px' }}
            >
              Rajarajeswari Dental College &amp; Hospital delivers expert patient care and trains future dental specialists — all on Mysore Road, Bangalore.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <Link
                to="/patient-portal"
                className="btn btn-secondary"
                style={{ padding: '0.95rem 2rem', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Phone size={16} /> Book Appointment
              </Link>
              <Link
                to="/admissions"
                style={{ padding: '0.95rem 2rem', fontSize: '1rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
              >
                Admissions 2025–26 <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Info strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}
            >
              {[
                { icon: <Clock size={14} />, text: 'Mon – Sat: 9 AM – 5 PM' },
                { icon: <MapPin size={14} />, text: 'Kumbalgodu, Mysore Rd, Bangalore' },
                { icon: <Phone size={14} />, text: '+91 80-2843 7373' },
              ].map((item, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.84rem' }}>
                  {item.icon} {item.text}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section style={{ background: 'var(--primary)', borderBottom: '3px solid var(--secondary)' }}>
        <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { target: 450, suffix: '+', label: 'Daily OPD Patients', icon: <Users size={26} /> },
              { target: 250, suffix: '+', label: 'Dental Chairs', icon: <Stethoscope size={26} /> },
              { target: 14, suffix: '', label: 'Speciality Depts.', icon: <Award size={26} /> },
              { target: 30, suffix: '+', label: 'Years of Excellence', icon: <GraduationCap size={26} /> },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ color: 'rgba(188,163,127,0.45)', marginBottom: '0.6rem' }}>{s.icon}</div>
                <div style={{ color: 'var(--secondary)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1 }}>
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY RRDCH
      ════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-main)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span style={{ display: 'inline-block', background: 'var(--secondary)', color: 'white', borderRadius: '4px', padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Our Philosophy</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--primary)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Why Choose RRDCH?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.8 }}>
              Building dentists who are clinically confident from day one. We bridge academic theory with high-volume practice at one of South India's largest dental hospitals.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                'NAAC A+ — highest dental college rating in Karnataka',
                'Specialised PG clinics matching international benchmarks',
                'Hands-on clinical exposure from BDS Year One',
                'Recognised by Royal College of Physicians, Glasgow (MFDS)',
                'Consistent RGUHS gold medalists & top rank-holders',
              ].map((text, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', listStyle: 'none' }}>
                  <CheckCircle size={19} color="var(--secondary)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ color: 'var(--text)', fontSize: '0.96rem', lineHeight: 1.6 }}>{text}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/about" className="btn btn-primary" style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 1.75rem' }}>
              About RRDCH <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ position: 'relative' }}>
            <img
              src="https://www.rrdch.org/rrdch/wp-content/uploads/2025/04/University-Rank-holders-banner-1024x352.jpg"
              alt="RRDCH RGUHS University Rank Holders 2023"
              style={{ borderRadius: 'var(--radius-lg)', width: '100%', objectFit: 'cover', height: '400px', boxShadow: '0 20px 60px rgba(43,58,49,0.14)' }}
              loading="lazy"
            />
            <div style={{ position: 'absolute', bottom: '-22px', left: '-22px', background: 'white', padding: '1.1rem 1.4rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--secondary)', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>30+</div>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Years of RGUHS Rankings</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DEPARTMENTS GRID — professional, no emojis
      ════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', color: 'var(--secondary)', border: '1px solid rgba(188,163,127,0.4)', borderRadius: '4px', padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Clinical Specialities</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--primary)', marginBottom: '0.75rem' }}>
              14 Departments, One World-Class Campus
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7, fontSize: '0.97rem' }}>
              Every dental speciality from preventive care to complex oral reconstruction — available to patients across Bangalore and Karnataka.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {DEPARTMENTS.map((dept, i) => (
              <motion.div
                key={i}
                whileHover={{ background: 'var(--bg-main)' }}
                style={{ background: 'white', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'default', transition: 'background 0.2s' }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', flexShrink: 0 }}>
                  {dept.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 0.3rem' }}>{dept.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>{dept.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/departments" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--secondary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
              View all 14 Departments <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ACCREDITATION
      ════════════════════════════════════════ */}
      <section style={{ padding: '4rem 0', background: 'var(--primary)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '2rem' }}>
            Recognised &amp; Accredited By
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0' }}>
            {[
              { label: 'NAAC A+', sub: 'Highest Accreditation' },
              { label: 'RGUHS', sub: 'University Affiliated' },
              { label: 'DCI', sub: 'Dental Council of India' },
              { label: 'IDA', sub: 'Indian Dental Association' },
              { label: 'Royal College', sub: 'Glasgow — MFDS' },
            ].map((org, i, arr) => (
              <div key={i} style={{ textAlign: 'center', padding: '0.75rem 2.5rem', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.04em' }}>{org.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{org.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          VIRTUAL TOUR + EVENTS
      ════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-main)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Virtual Tour */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Video color="var(--secondary)" size={20} /> 360° Virtual Campus Tour
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Explore our campus and clinical floors remotely.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {[{ id: 'campus', label: 'Campus View' }, { id: 'clinic', label: 'Clinical Floor' }].map(m => (
                <button key={m.id} onClick={() => setActiveTour(m.id)}
                  className={`btn ${activeTour === m.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}>
                  {m.label}
                </button>
              ))}
            </div>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {activeTour === 'campus' && (
                <iframe src="https://www.google.com/maps/embed?pb=!4v1776103118990!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0txcW1UZmc.!2m2!1d12.88721965030684!2d77.45080397496581!3f300!4f10!5f0.7820865974627469" width="100%" height="270" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="RRDCH Campus 360 Tour" />
              )}
              {activeTour === 'clinic' && (
                <iframe src="https://www.google.com/maps/embed?pb=!4v1776103274328!6m8!1m7!1sZ8pM1ZDcmbLBRLt4xTUTKw!2m2!1d12.88715964343887!2d77.45037912045206!3f62.522002999999984!4f0!5f0.7820865974627469" width="100%" height="270" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="RRDCH Clinical Floor 360 Tour" />
              )}
            </div>
            <a href="https://www.google.com/maps/dir//RajaRajeswari+Dental+College+Hospital,+Mysore+Road,+Ramohalli+Cross,+Kumbalgodu,+Bengaluru,+Karnataka+560074" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.7rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'border-color 0.2s, color 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              <Map size={15} /> Get Directions on Google Maps
            </a>
          </div>

          {/* Events */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar color="var(--secondary)" size={20} /> Academic Calendar
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>Upcoming workshops, conferences &amp; college events.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {events.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  No upcoming events scheduled. Check back soon.
                </div>
              ) : (
                events.map((evt, idx) => {
                  const d = evt.event_date ? new Date(evt.event_date + 'T00:00:00') : null;
                  const day = d ? String(d.getDate()).padStart(2, '0') : '—';
                  const mon = d ? d.toLocaleString('en', { month: 'short' }).toUpperCase() : '';
                  return (
                    <Link to="/events" key={idx}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#EDE8DF'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--bg-main)'}
                    >
                      <div style={{ textAlign: 'center', background: 'white', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)', minWidth: '50px', borderTop: '3px solid var(--secondary)' }}>
                        <strong style={{ display: 'block', color: 'var(--primary)', fontSize: '1.1rem', lineHeight: 1 }}>{day}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.05em' }}>{mon}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', color: 'var(--primary)', lineHeight: 1.35 }}>{evt.title}</h4>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{evt.type} &bull; {evt.location}</span>
                      </div>
                      <ArrowRight size={15} color="var(--text-muted)" />
                    </Link>
                  );
                })
              )}
            </div>

            <Link to="/events"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', padding: '0.7rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'border-color 0.2s, color 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              View Full Academic Calendar <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'white', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', color: 'var(--secondary)', border: '1px solid rgba(188,163,127,0.4)', borderRadius: '4px', padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Patient &amp; Student Voices</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--primary)', marginBottom: '3rem' }}>
            What People Say About RRDCH
          </h2>

          <div style={{ position: 'relative', minHeight: '140px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
              >
                <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.12rem)', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  &ldquo;{TESTIMONIALS[testimonialIdx].quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                    {TESTIMONIALS[testimonialIdx].name[0]}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', color: 'var(--primary)', fontSize: '0.95rem' }}>{TESTIMONIALS[testimonialIdx].name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{TESTIMONIALS[testimonialIdx].role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)} aria-label={`View testimonial ${i + 1}`}
                style={{ width: i === testimonialIdx ? '28px' : '8px', height: '8px', borderRadius: '999px', background: i === testimonialIdx ? 'var(--secondary)' : 'var(--border-color)', border: 'none', cursor: 'pointer', transition: 'all 0.35s', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
