import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Menu, X, LogIn, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('about'), path: '/about' },
    { name: t('departments'), path: '/departments' },
    { name: t('admissions'), path: '/admissions' },
  ];

  return (
    <nav className="navbar" style={{ borderBottom: '1px solid var(--border-color)', background: 'white' }}>
      <div className="nav-container flex justify-between items-center" style={{ width: '100%', padding: '1rem 2rem' }}>
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '3rem', textDecoration: 'none' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1qfVUooLG_KIMv4V7fpwAa3YDDm-cZ35PQ&s" alt="RRDCH Logo" style={{ height: '48px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', margin: 0, padding: 0, lineHeight: 1 }}>RajaRajeswari</h1>
            </div>

            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'Jost, sans-serif' }}>Dental College & Hospital</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1, gap: 0 }}>

          {/* Main Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {navItems.map((item) => (
              <MotionLink
                key={item.path}
                to={item.path}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`nav-item ${isActive(item.path)}`}
                style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 500, padding: '0.5rem 0', position: 'relative', display: 'inline-block' }}>
                {item.name}
              </MotionLink>
            ))}

            <div onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)} style={{ position: 'relative' }}>
              <span className="nav-item" style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '2px' }}>
                More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </span>
              {moreOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', display: 'flex', flexDirection: 'column', padding: '0.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid var(--border-color)', minWidth: '220px', zIndex: 50, gap: '0.5rem' }}>

                  {/* Internal Links (Existing) */}
                  <Link to="/gallery" style={{ padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }} className="hover:text-primary">Campus Gallery</Link>
                  <Link to="/faculty" style={{ padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }} className="hover:text-primary">Faculty & Doctors</Link>
                  <Link to="/events" style={{ padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }} className="hover:text-primary">Calendar of Events</Link>
                  <Link to="/news" style={{ padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }} className="hover:text-primary">News & Updates</Link>
                  <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }}></div>

                  {/* Nested Academics */}
                  <div className="relative nested-dropdown-parent" style={{ padding: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-main)' }}>
                    <span className="hover:text-primary text-[0.95rem]">Academics</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    <div className="nested-dropdown-child">
                      <Link to="/academics" state={{ tab: 'BDS' }} className="hover:text-primary p-2 text-[0.95rem] text-main">UG Curriculum (BDS)</Link>
                      <Link to="/academics" state={{ tab: 'MDS' }} className="hover:text-primary p-2 text-[0.95rem] text-main">PG Curriculum (MDS)</Link>
                      <Link to="/academics" state={{ tab: 'PHD' }} className="hover:text-primary p-2 text-[0.95rem] text-main">PhD Programs</Link>
                    </div>
                  </div>

                  {/* Nested Committees */}
                  <div className="relative nested-dropdown-parent" style={{ padding: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-main)' }}>
                    <span className="hover:text-primary text-[0.95rem]">Committees</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    <div className="nested-dropdown-child">
                      <Link to="/committees" state={{ tab: 'anti-ragging' }} className="hover:text-primary p-2 text-[0.95rem] text-main">Anti-Ragging Squad</Link>
                      <Link to="/committees" state={{ tab: 'ethics' }} className="hover:text-primary p-2 text-[0.95rem] text-main">Ethical Guidelines</Link>
                      <Link to="/committees" state={{ tab: 'iqac' }} className="hover:text-primary p-2 text-[0.95rem] text-main">Internal Quality Assurance (IQAC)</Link>
                    </div>
                  </div>

                  {/* Nested Campus Life */}
                  <div className="relative nested-dropdown-parent" style={{ padding: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-main)' }}>
                    <span className="hover:text-primary text-[0.95rem]">Campus Life</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    <div className="nested-dropdown-child">
                      <Link to="/campus-life" state={{ tab: 'Hostel' }} className="hover:text-primary p-2 text-[0.95rem] text-main">Hostel Facilities</Link>
                      <Link to="/campus-life" state={{ tab: 'Library' }} className="hover:text-primary p-2 text-[0.95rem] text-main">Library & Reading Rooms</Link>
                      <Link to="/campus-life" state={{ tab: 'Sports' }} className="hover:text-primary p-2 text-[0.95rem] text-main">Sports & Gym</Link>
                    </div>
                  </div>

                  <Link to="/contact" style={{ padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }} className="hover:text-primary">Contact Us</Link>
                </div>
              )}
            </div>
          </div>

          <div style={{ width: '1px', height: '30px', background: 'var(--border-color)', margin: '0 2rem' }}></div>

          {/* Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <MotionLink to="/patient-portal" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn" style={{ background: '#BEA370', color: 'white', borderRadius: 'var(--radius-full)', padding: '0.6rem 1.5rem', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={16} /> {t('patientPortal')}
            </MotionLink>

            <MotionLink
              to="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--primary)', color: 'var(--primary)',
                fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.2s', letterSpacing: '0.03em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}
            >
              <LogIn size={15} /> Portal Login
            </MotionLink>

            <button onClick={toggleLanguage} aria-label="Toggle Language" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'transparent', cursor: 'pointer' }}>
              <Languages size={16} /> {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} style={{ borderBottom: '1px solid var(--border-color)' }}>
              {item.name}
            </Link>
          ))}
          <Link to="/gallery" onClick={() => setIsOpen(false)} style={{ borderBottom: '1px solid var(--border-color)' }}>Gallery</Link>
          <Link to="/faculty" onClick={() => setIsOpen(false)} style={{ borderBottom: '1px solid var(--border-color)' }}>Faculty</Link>
          <Link to="/news" onClick={() => setIsOpen(false)} style={{ borderBottom: '1px solid var(--border-color)' }}>News</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} style={{ borderBottom: '1px solid var(--border-color)' }}>Contact</Link>
          <Link to="/patient-portal" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-secondary">
            <Stethoscope size={18} /> {t('patientPortal')}
          </Link>
          <Link to="/login" onClick={() => setIsOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>
            <LogIn size={18} /> Portal Login
          </Link>
          <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="btn btn-outline flex items-center justify-center gap-2 mt-2">
            <Languages size={18} /> {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
