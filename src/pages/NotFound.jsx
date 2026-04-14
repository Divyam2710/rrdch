import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container flex flex-col items-center justify-center text-center py-24" style={{ minHeight: '60vh' }}>
      <AlertCircle size={80} color="var(--danger)" style={{ marginBottom: '2rem' }} />
      <h1 className="text-primary tracking-tight" style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 className="text-secondary mb-4" style={{ fontSize: '2rem' }}>Page Not Found</h2>
      <p className="text-muted text-lg max-w-lg mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary py-3 px-8 text-lg hover:-translate-y-1 transition-transform">
        Return to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFound;
