import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true, message = "Processing..." }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6 p-12 bg-white rounded-xl shadow-lg border" style={{ borderColor: 'var(--border-color)', minWidth: '300px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          width: '60px',
          height: '60px',
          border: '5px solid rgba(43, 58, 49, 0.1)',
          borderTop: '5px solid var(--primary)',
          borderRadius: '50%'
        }}
      />
      <div className="text-primary font-bold text-lg">{message}</div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10500] flex items-center justify-center"
        style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(6px)' }}
      >
        {loaderContent}
      </motion.div>
    );
  }

  return loaderContent;
};

export default Loader;
