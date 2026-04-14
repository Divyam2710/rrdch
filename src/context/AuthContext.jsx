import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('rrdch_user');
    const savedToken = localStorage.getItem('rrdch_token');
    if (savedUser && savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('rrdch_user');
          localStorage.removeItem('rrdch_token');
        } else {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (err) {
        localStorage.removeItem('rrdch_user');
        localStorage.removeItem('rrdch_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch {
      throw new Error('Cannot reach server. Please ensure the backend is running.');
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server error (${res.status}). The API may be offline or returning an unexpected response.`);
    }

    if (!res.ok) throw new Error(data.error || data.message || 'Login failed. Please check your credentials.');

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('rrdch_user', JSON.stringify(data.user));
    localStorage.setItem('rrdch_token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rrdch_user');
    localStorage.removeItem('rrdch_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
