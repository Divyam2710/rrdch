import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, BookOpen, Users, Star } from 'lucide-react';

const milestones = [
  { year: '1992', text: 'Established with 40 BDS admissions under Rajya Vokkalinga Sangha trust.' },
  { year: '2002', text: 'Formally recognized by the Dental Council of India (DCI).' },
  { year: '2005', text: 'Commenced Post Graduate MDS programs across 9 specialties.' },
  { year: '2015', text: 'Received NABH accreditation for hospital quality standards.' },
  { year: '2023', text: 'Awarded the prestigious NAAC A+ Accreditation — the highest academic recognition.' },
];

const stats = [
  { icon: <Users size={28} />, value: '450+', label: 'Daily OPD Patients' },
  { icon: <Award size={28} />, value: 'NAAC A+', label: 'Accreditation' },
  { icon: <BookOpen size={28} />, value: '14', label: 'Departments' },
  { icon: <Star size={28} />, value: '30+', label: 'Years of Excellence' },
];

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

      {/* Hero Banner */}
      <section className="relative" style={{ minHeight: '380px', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--primary)' }}>
        <img
          src="https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/about.jpg"
          alt="RRDCH Campus"
          className="hero-ken-burns"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(43,58,49,0.97) 0%, rgba(188,163,127,0.7) 100%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2, padding: '4rem 1.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.2)', border: '1px solid rgba(188,163,127,0.4)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              NAAC A+ Accredited Institution
            </span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '1.2rem' }}>
              About <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>RRDCH</span>
            </h1>
            <p className="text-light max-w-3xl mx-auto" style={{ fontSize: '1.15rem', opacity: 0.85, lineHeight: 1.7 }}>
              For over 30 years, Rajarajeswari Dental College & Hospital has been shaping distinguished dental professionals through world-class education and compassionate patient care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: 'white', borderBottom: '3px solid var(--secondary)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0' }}>
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ backgroundColor: '#FAF9F6' }}
              style={{ padding: '1.8rem', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background 0.2s' }}>
              <div style={{ color: 'var(--secondary)', display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.3rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="py-24 bg-main">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Left: Image + Accreditations */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div style={{ position: 'relative' }}>
              <img
                loading="lazy"
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dental Lab"
                style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%', objectFit: 'cover', height: '380px' }}
              />
              {/* Floating badge */}
              <div style={{ position: 'absolute', bottom: '-20px', right: '20px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>30+</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Years Legacy</div>
              </div>
            </div>

            {/* Accreditation logos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '3.5rem' }}>
              {[
                { src: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/naac.png', alt: 'NAAC' },
                { src: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/NABH.png', alt: 'NABH' },
                { src: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/iso1.png', alt: 'ISO 9001' },
              ].map((logo, i) => (
                <motion.div key={i} whileHover={{ y: -4 }}
                  style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90px' }}>
                  <img src={logo.src} alt={logo.alt} loading="lazy" style={{ maxHeight: '55px', maxWidth: '100%', objectFit: 'contain' }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Principal's Message + Timeline */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            {/* Principal's Message */}
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Dean's Message</span>
              <h2 className="text-primary" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>A Message From Our Leadership</h2>

              <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1.5rem', marginBottom: '1.5rem', background: 'white', borderRadius: '0 var(--radius-md) var(--radius-md) 0', padding: '1.5rem 1.5rem 1.5rem 2rem', boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-muted" style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '1rem' }}>
                  "RRDCH is committed to providing world-class dental education and exceptional clinical care. Our sprawling campus, 250+ modern dental units, and esteemed faculty ensure our students are uniquely prepared to lead the future of global dentistry."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1.1rem' }}>D</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Dr. Edwin Devadoss</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dean, RRDCH</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <h3 className="text-primary" style={{ marginBottom: '1.5rem' }}>Our Journey</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {milestones.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: '1.2rem', paddingBottom: i !== milestones.length - 1 ? '1.5rem' : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={18} color="var(--secondary)" />
                    </div>
                    {i !== milestones.length - 1 && <div style={{ width: '2px', flexGrow: 1, background: 'var(--border-color)', margin: '4px 0' }}></div>}
                  </div>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <span style={{ display: 'inline-block', fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>{m.year}</span>
                    <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default About;
