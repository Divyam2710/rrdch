import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--primary-dark, #1a2420)', color: 'white', paddingTop: '3.5rem', paddingBottom: 0, marginTop: 'auto' }}>
      <div className="container grid grid-cols-4 gap-8" style={{ minWidth: '800px', overflowX: 'auto' }}>
        <div className="flex flex-col gap-4">
          <h2 style={{ color: 'white', fontSize: '1.25rem' }}>RRDCH</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Providing world-class dental education and exceptional patient care since our inception.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-secondary hover:text-white transition-colors font-bold">FB</a>
            <a href="#" className="text-secondary hover:text-white transition-colors font-bold">X</a>
            <a href="#" className="text-secondary hover:text-white transition-colors font-bold">IG</a>
            <a href="#" className="text-secondary hover:text-white transition-colors font-bold">IN</a>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Quick Links</h3>
          <ul className="flex flex-col gap-2" style={{ color: 'var(--text-muted)' }}>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/admissions" className="hover:text-white">Admissions</a></li>
            <li><a href="/departments" className="hover:text-white">Departments</a></li>
            <li><a href="/research-publication" className="hover:text-white">Research & Publications</a></li>
            <li><a href="/gallery" className="hover:text-white">Campus Gallery</a></li>
            <li><a href="/faculty" className="hover:text-white">Faculty Directory</a></li>
            <li><a href="/news" className="hover:text-white">News Feed</a></li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Portals</h3>
          <ul className="flex flex-col gap-2" style={{ color: 'var(--text-muted)' }}>
            <li><a href="/patient-portal" className="hover:text-white">Book Appointment</a></li>
            <li><a href="/student-dashboard" className="hover:text-white">Student Dashboard</a></li>
            <li><a href="/admin" className="hover:text-white">Admin Login</a></li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>Contact Us</h3>
          <ul className="flex flex-col gap-2" style={{ color: 'var(--text-muted)' }}>
            <li className="flex items-start gap-2">
              <MapPin size={16} style={{ marginTop: '0.25rem', flexShrink: 0 }} /> 
              <span>No.14, Ramohalli Cross, Kumbalgodu,<br/>Mysore Road, Bangalore-560074</span>
            </li>
            <li className="flex items-center gap-2"><Phone size={16} /> +91-80-2843 7150 / 7468</li>
            <li className="flex items-center gap-2"><Mail size={16} /> principalrrdch@gmail.com</li>
          </ul>
        </div>
      </div>
      
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '2.5rem', padding: '1rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Rajarajeswari Dental College &amp; Hospital. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
