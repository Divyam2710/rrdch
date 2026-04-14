import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: type === 'list' ? 'column' : 'row',
    gap: '1rem',
    flexWrap: type === 'grid' ? 'wrap' : 'nowrap',
  };

  const skeletonStyles = {
    card: { width: '100%', height: '200px', borderRadius: 'var(--radius-md)' },
    list: { width: '100%', height: '60px', borderRadius: 'var(--radius-sm)' },
    text: { width: '80%', height: '20px', borderRadius: '4px', marginBottom: '0.5rem' },
    grid: { width: 'calc(50% - 0.5rem)', height: '150px', borderRadius: 'var(--radius-md)' }
  };

  const shimmerAnimation = {
    initial: { backgroundColor: 'var(--border-color)', opacity: 0.5 },
    animate: { 
        backgroundColor: ['var(--border-color)', 'var(--bg-main)', 'var(--border-color)'],
        opacity: [0.5, 1, 0.5] 
    },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <div style={containerStyle} className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div 
            key={i}
            initial="initial"
            animate="animate"
            variants={shimmerAnimation}
            transition={shimmerAnimation.transition}
            style={{ ...skeletonStyles[type], background: 'var(--border-color)' }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
