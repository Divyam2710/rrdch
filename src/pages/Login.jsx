import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, User, Stethoscope, GraduationCap, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = [
  {
    key: 'student',
    label: 'Student',
    icon: <GraduationCap size={22} />,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Student Academic Portal',
    subtitle: 'Access your schedule, clinical case log, and digital library.',
    placeholder: 'student@rrdch.ac.in',
    redirect: '/student-dashboard',
  },
  {
    key: 'pg',
    label: 'PG Doctor',
    icon: <Stethoscope size={22} />,
    color: '#B45309',
    bg: '#FFFBEB',
    title: 'PG Doctor Portal',
    subtitle: 'Manage patient queues, clinical sessions, and research submissions.',
    placeholder: 'pg.doctor@rrdch.ac.in',
    redirect: '/pg-dashboard',
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: <ShieldCheck size={22} />,
    color: '#991B1B',
    bg: '#FEF2F2',
    title: 'Admin Control Panel',
    subtitle: 'Hospital-wide operations, credential registry, and reporting.',
    placeholder: 'admin@rrdch.ac.in',
    redirect: '/admin',
  },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const role = roles.find(r => r.key === selectedRole);

  const handleRoleChange = (key) => {
    setSelectedRole(key);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back! Logged in as ${user.role}.`, 'success');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'student') navigate('/student-dashboard');
      else if (user.role === 'pg') navigate('/pg-dashboard');
      else if (user.role === 'patient') navigate('/patient-portal');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'stretch', background: '#F3F4F6' }}>

      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{
          flex: '0 0 42%', background: role.color, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '4rem 3.5rem', position: 'relative', overflow: 'hidden',
        }}
        className="login-left-panel"
      >
        {/* Background radial glow */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '4rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', fontFamily: 'Playfair Display, serif', lineHeight: 1.1 }}>RRDCH</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Secure Portal</div>
            </div>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div key={selectedRole} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.4rem 1rem', borderRadius: '999px', marginBottom: '1.5rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>{role.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>{role.label} Access</span>
              </div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.15, marginBottom: '1rem', fontFamily: 'Playfair Display, serif' }}>
                {role.title}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1rem', maxWidth: '320px' }}>
                {role.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom link */}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          Not a staff member?{' '}
          <Link to="/patient-portal" style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, textDecoration: 'underline' }}>
            Patient Portal →
          </Link>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3rem', background: 'white' }}
        className="login-right-panel"
      >
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>

          {/* Role Tabs */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF', fontWeight: 700, marginBottom: '0.75rem' }}>
              Select your role
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', background: '#F3F4F6', borderRadius: '12px', padding: '4px' }}>
              {roles.map(r => (
                <button key={r.key} onClick={() => handleRoleChange(r.key)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                    padding: '0.65rem 0.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedRole === r.key ? 'white' : 'transparent',
                    boxShadow: selectedRole === r.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    color: selectedRole === r.key ? r.color : '#9CA3AF',
                    fontWeight: selectedRole === r.key ? 700 : 500,
                  }}>
                  {r.icon}
                  <span style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#111827', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', fontFamily: 'Playfair Display, serif' }}>
              Sign In
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
              Enter your institutional credentials below
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.9rem 1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div style={{ fontSize: '0.875rem', color: '#991B1B', lineHeight: 1.5 }}>{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={role.placeholder}
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
                    border: '1.5px solid #E5E7EB', borderRadius: '10px',
                    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
                    background: '#FAFAFA', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = role.color}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '0.75rem 3rem 0.75rem 2.75rem',
                    border: '1.5px solid #E5E7EB', borderRadius: '10px',
                    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
                    background: '#FAFAFA', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = role.color}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600 }}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
                background: loading ? '#E5E7EB' : role.color, color: 'white',
                fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'background 0.2s', marginTop: '0.5rem',
                boxShadow: loading ? 'none' : `0 4px 14px ${role.color}40`
              }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.3"/><path d="M21 12a9 9 0 00-9-9"/></svg>
                  Authenticating...
                </span>
              ) : (
                <>Sign In <ChevronRight size={18} /></>
              )}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.82rem', color: '#9CA3AF' }}>
            <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Secured by JWT authentication · RRDCH {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
