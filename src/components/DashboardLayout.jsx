import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children, title, subtitle, navigationLinks, headerActions, accentColor = 'var(--primary)' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F3F4F6' }}>
      {/* Top Bar */}
      <header style={{
        background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" style={{ padding: '0.5rem', color: 'var(--primary)', display: 'none' }} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Activity size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', lineHeight: 1.1, fontFamily: 'Playfair Display, serif' }}>RRDCH</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Portal</div>
            </div>
          </Link>
          {/* Breadcrumb divider */}
          <div style={{ width: '1px', height: '28px', background: '#E5E7EB', margin: '0 0.5rem' }}></div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem', lineHeight: 1.1 }}>{title}</div>
            {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {headerActions}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #E5E7EB', transition: 'all 0.2s', textDecoration: 'none' }}>
            <Home size={14} /> Back to Site
          </Link>
        </div>
      </header>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px', flexShrink: 0, background: 'white', borderRight: '1px solid #E5E7EB',
          display: 'flex', flexDirection: 'column', position: 'sticky', top: '57px', height: 'calc(100vh - 57px)',
          overflowY: 'auto'
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: accentColor, marginBottom: '0.25rem' }}>Navigation</div>
          </div>

          <nav style={{ padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navigationLinks.map((link, i) => (
              <div key={i}>
                {link.heading && (
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#9CA3AF', margin: '1rem 0.5rem 0.4rem', letterSpacing: '0.08em' }}>
                    {link.heading}
                  </div>
                )}
                {link.path && (
                  <Link to={link.path} onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.65rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                      fontSize: '0.875rem', fontWeight: isActive(link.id) ? 700 : 500,
                      background: isActive(link.id) ? `${accentColor}14` : 'transparent',
                      color: isActive(link.id) ? accentColor : '#374151',
                      borderLeft: isActive(link.id) ? `3px solid ${accentColor}` : '3px solid transparent',
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ color: isActive(link.id) ? accentColor : '#9CA3AF', display: 'flex' }}>{link.icon}</span>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div style={{ marginTop: 'auto', padding: '1rem 1.25rem', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
            <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textAlign: 'center' }}>
              RRDCH Secure Portal · {new Date().getFullYear()}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem', background: '#F3F4F6' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: flex !important; }
          aside {
            position: fixed !important;
            top: 57px !important;
            left: ${isOpen ? '0' : '-280px'} !important;
            height: calc(100vh - 57px) !important;
            z-index: 90 !important;
            transition: left 0.3s ease !important;
            box-shadow: 4px 0 20px rgba(0,0,0,0.1) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
