import React, { createContext, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: toasts.length > 0 ? 'auto' : 'none', backgroundColor: toasts.length > 0 ? 'rgba(0,0,0,0.4)' : 'transparent', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '24px 32px',
                minWidth: '350px',
                maxWidth: '500px',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                borderTop: `6px solid ${
                  toast.type === 'error' ? 'var(--danger)' : 
                  toast.type === 'success' ? 'var(--success)' : 'var(--primary)'
                }`
              }}
            >
              {toast.type === 'error' && <AlertCircle size={20} color="var(--danger)" />}
              {toast.type === 'success' && <CheckCircle size={20} color="var(--success)" />}
              {toast.type === 'info' && <Info size={20} color="var(--primary)" />}
              
              <span className="text-main flex-grow text-center text-lg font-bold">{toast.message}</span>
              
              <button 
                onClick={() => removeToast(toast.id)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.6 }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
