import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Pin, Megaphone } from 'lucide-react';
import Loader from '../components/Loader';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => { setNews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const pinned = news.filter(n => n.pinned);
  const regular = news.filter(n => !n.pinned);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(188,163,127,0.15) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Campus <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>News & Circulars</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
              Stay informed with the latest announcements, campus events, and institutional notices from RRDCH.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-main">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {loading ? <Loader /> : (
            <>
              {news.length === 0 && (
                <div className="card text-center" style={{ padding: '4rem' }}>
                  <Megaphone size={48} color="var(--secondary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 className="text-primary">No Updates Posted Yet</h3>
                  <p className="text-muted">Check back soon for campus news and announcements.</p>
                </div>
              )}
              {/* Pinned */}
              {pinned.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Pin size={16} color="var(--secondary)" />
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--secondary)' }}>Pinned Announcements</span>
                  </div>
                  {pinned.map((item, i) => (
                    <motion.div key={item.id} whileHover={{ x: 4 }} className="card" style={{ borderLeft: '5px solid var(--secondary)', marginBottom: '1rem', padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <h3 className="text-primary" style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Pin size={15} color="var(--secondary)" /> {item.title}
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-main)', margin: '0 0 1rem', lineHeight: 1.7 }}>{item.content}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <Bell size={13} /> Posted by {item.author}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Regular */}
              {regular.length > 0 && (
                <div>
                  {pinned.length > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Bell size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-muted)' }}>All Updates</span>
                  </div>}
                  {regular.map((item) => (
                    <motion.div key={item.id} whileHover={{ x: 4 }} className="card" style={{ borderLeft: '5px solid var(--border-color)', marginBottom: '1rem', padding: '1.5rem 2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <h3 className="text-primary" style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-main)', margin: '0 0 1rem', lineHeight: 1.7 }}>{item.content}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <Bell size={13} /> Posted by {item.author}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default News;
