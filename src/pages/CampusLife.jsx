import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, Users, Wifi, ChevronRight } from 'lucide-react';

const tabs = [
  {
    key: 'Hostel', label: 'Hostel', icon: <Home size={20} />,
    title: 'Hostels & Accommodation',
    desc: 'Separate, highly secure hostel blocks for boys and girls exist within the campus. Accommodations range from private rooms for PG students to shared dormitories for UG students, all equipped with high-speed WiFi, RO water, and continuous backup power.',
    features: ['Zero-Ragging Secure Zone', 'In-house Mess (Multi-cuisine)', 'High-Speed WiFi & 24/7 Security', 'Separate Boys & Girls Blocks with Wardens'],
    image: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/hostel1-1.jpg',
  },
  {
    key: 'Library', label: 'Library', icon: <BookOpen size={20} />,
    title: 'Central Library & Reading Rooms',
    desc: 'Our 8,000 sq ft. digital library is an unparalleled academic asset. It houses over 7,000 reference dental books, national and international journals, and a heavy-duty e-library portal providing access to EBSCO and ProQuest databases.',
    features: ['400-Seat Reading Capacity', '8:00 AM – 10:00 PM Hours', 'EBSCO & ProQuest e-Library Access', 'Dedicated Seminar & Discussion Rooms'],
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/library-1.jpg',
  },
  {
    key: 'Sports', label: 'Sports & Gym', icon: <Trophy size={20} />,
    title: 'Sports Complex & Gymnasium',
    desc: 'Physical fitness is vital for precision and focus in dentistry. Our campus includes a fully-equipped modern gymnasium with professional equipment, indoor badminton courts, and extensive outdoor grounds for cricket and football tournaments.',
    features: ['Professional Athletic Coach on Staff', 'Annual RajaRajeswari Sports Cup', 'Multi-sport Outdoor Courts', 'Modern Gymnasium & Fitness Equipment'],
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/sports3.jpg',
  },
];

const CampusLife = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Hostel');

  useEffect(() => {
    if (location.state && location.state.tab) setActiveTab(location.state.tab);
  }, [location]);

  const active = tabs.find(t => t.key === activeTab);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top left, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', border: '1px solid rgba(188,163,127,0.3)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Beyond the Classroom</span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Life at <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              We believe in holistic development. RRDCH offers premium infrastructure ensuring comfort, health, learning, and recreation for all students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Nav */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: '5rem', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.1rem 2rem',
                fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.key ? '3px solid var(--secondary)' : '3px solid transparent',
                background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '3px solid var(--secondary)' : '3px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', fontSize: '0.95rem'
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-main">
        <div className="container">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div key={active.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                {/* Image */}
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                  <img src={active.image} alt={active.title} style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
                </div>
                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                    {active.icon}
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Campus Facility</span>
                  </div>
                  <h2 className="text-primary" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '0 0 1.2rem' }}>{active.title}</h2>
                  <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>{active.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {active.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                        <ChevronRight size={16} color="var(--secondary)" style={{ flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem' }}>{f}</span>
                      </div>
                    ))}
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

export default CampusLife;
