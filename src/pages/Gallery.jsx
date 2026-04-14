import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [images, setImages] = useState([
    { url: "https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/about.jpg", caption: "Main Campus Building" },
    { url: "https://www.rrdch.org/rrdch/wp-content/uploads/2025/04/University-Rank-holders-banner-1024x352.jpg", caption: "University Rank Holders" },
    { url: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80", caption: "Research Laboratory" },
    { url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80", caption: "Operation Theatre" },
    { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", caption: "Library Reading Room" },
    { url: "https://images.unsplash.com/photo-1551076805-e1869043e560?auto=format&fit=crop&w=800&q=80", caption: "Student Clinic" },
  ]);

  React.useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) setImages(data);
    }).catch(() => {});
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top left, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Campus <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Gallery</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              A visual tour through our state-of-the-art facilities, vibrant campus life, and academic milestones.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-main">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {images.map((img, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImg(img)}
                style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'zoom-in', position: 'relative', boxShadow: 'var(--shadow-sm)', background: '#000' }}
              >
                <img src={img.url} alt={img.caption} loading="lazy"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'opacity 0.3s', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', display: 'flex', alignItems: 'flex-end', padding: '1rem', opacity: 0, transition: 'opacity 0.3s' }}
                  className="gallery-caption">
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{img.caption}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '900px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 40px 60px rgba(0,0,0,0.5)' }}>
              <img src={selectedImg.url} alt={selectedImg.caption} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', background: '#111' }} />
              <div style={{ background: 'rgba(0,0,0,0.8)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontWeight: 600 }}>{selectedImg.caption}</span>
                <button onClick={() => setSelectedImg(null)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.8 }}>
                  <X size={20} /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
