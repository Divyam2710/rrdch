import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, NavLink } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { Home as HomeIcon, Grid, Phone, Stethoscope } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Admissions from './pages/Admissions';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Faculty from './pages/Faculty';
import News from './pages/News';
import CalendarOfEvents from './pages/CalendarOfEvents';
import Curriculum from './pages/Curriculum';
import Committees from './pages/Committees';
import CampusLife from './pages/CampusLife';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';

const PatientPortal = lazy(() => import('./pages/PatientPortal'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PgDashboard = lazy(() => import('./pages/PgDashboard'));


// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4 text-center p-8">
         <h1 className="text-4xl text-danger mb-2">Access Denied!</h1>
         <p className="text-muted text-lg max-w-lg">
            Your current account role (<strong>{user.role}</strong>) is not authorized to view the <strong>{allowedRoles.join(' or ')}</strong> portal.
         </p>
         <button onClick={() => {
              localStorage.removeItem('rrdch_user');
              localStorage.removeItem('rrdch_token');
              window.location.href = '/login';
         }} className="btn btn-outline border-danger text-danger mt-4">
            Sign Out & Switch Account
         </button>
      </div>
    );
  }

  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="flex-grow" style={{ paddingTop: '5rem' }}>{children}</main>
    <Footer />
    {/* Mobile Bottom Nav - visible only on small screens via CSS */}
    <nav className="mobile-bottom-nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
        <HomeIcon size={20} />
        Home
      </NavLink>
      <NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''}>
        <Grid size={20} />
        Depts
      </NavLink>
      <NavLink to="/patient-portal" className={({ isActive }) => isActive ? 'active' : ''}>
        <Stethoscope size={20} />
        Book
      </NavLink>
      <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
        <Phone size={20} />
        Contact
      </NavLink>
    </nav>
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Global Navbar */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
        <Route path="/departments" element={<PublicLayout><Departments /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/faculty" element={<PublicLayout><Faculty /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><CalendarOfEvents /></PublicLayout>} />
        <Route path="/academics" element={<PublicLayout><Curriculum /></PublicLayout>} />
        <Route path="/committees" element={<PublicLayout><Committees /></PublicLayout>} />
        <Route path="/campus-life" element={<PublicLayout><CampusLife /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

        {/* Protected App Shell Routes (No Global Navbar) */}
        <Route path="/patient-portal/*" element={
          <Suspense fallback={<Loader />}><PatientPortal /></Suspense>
        } />
        <Route path="/student-dashboard/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Suspense fallback={<Loader />}><StudentDashboard /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="/pg-dashboard/*" element={
          <ProtectedRoute allowedRoles={['pg']}>
            <Suspense fallback={<Loader />}><PgDashboard /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={<Loader />}><AdminDashboard /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <AnimatedRoutes />
              </div>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
