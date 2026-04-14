import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Award, Stethoscope, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Curriculum = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('BDS');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Hero Banner */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '4rem 0 3rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', border: '1px solid rgba(188,163,127,0.3)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>DCI & RGUHS Approved</span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Academic <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Programs</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>Approved by the Dental Council of India (DCI) and affiliated with RGUHS — designed to mold leading clinical practitioners and researchers.</p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="py-10 bg-main">
        <div className="container">
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { key: 'BDS', label: 'BDS (Undergrad)', icon: <GraduationCap size={20} /> },
            { key: 'MDS', label: 'MDS (Postgrad)', icon: <Award size={20} /> },
            { key: 'PHD', label: 'Doctoral (PhD)', icon: <BookOpen size={20} /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-outline'}`}
              style={{ minWidth: '180px', fontSize: '1rem' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {/* Dynamic Content */}
        <div className="bg-white p-8 md:p-12 border rounded-xl shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
        
        {activeTab === 'BDS' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl mb-6 text-primary flex items-center gap-3">
              <Stethoscope color="var(--secondary)"/> Bachelor of Dental Surgery
            </h2>
            <p className="text-lg text-muted mb-8">
              A comprehensive 4-year academic program followed by a 1-year mandatory rotatory internship. The curriculum seamlessly integrates basic medical sciences with intensive clinical dental practice.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              
              <div className="card bg-gray-50 border-0 shadow-none">
                <h3 className="text-xl mb-4 flex items-center gap-2"><BookOpen size={18}/> Phase 1 (Years 1 & 2)</h3>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Human Anatomy, Histology & Embryology</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Human Physiology & Biochemistry</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Dental Anatomy, Embryology & Oral Histology</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> General Pathology & Microbiology</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> General & Dental Pharmacology</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Pre-clinical Conservative & Prosthodontics</li>
                </ul>
              </div>

              <div className="card bg-gray-50 border-0 shadow-none">
                <h3 className="text-xl mb-4 flex items-center gap-2"><BookOpen size={18}/> Phase 2 (Years 3 & 4)</h3>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> General Medicine & General Surgery</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Oral Pathology & Oral Microbiology</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Public Health Dentistry & Periodontology</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Orthodontics & Oral Medicine</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Oral & Maxillofacial Surgery</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Conservative Dentistry & Endodontics</li>
                </ul>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === 'MDS' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <h2 className="text-3xl mb-6 text-primary flex items-center gap-3">
              <Award color="var(--secondary)"/> Master of Dental Surgery
            </h2>
            <p className="text-lg text-muted mb-8">
              A 3-year rigorous postgraduate program featuring advanced clinical training, dissertation/research work, journal clubs, and specialized faculty mentorship.
            </p>

            <h3 className="text-xl mb-6">The 8 Specialized Departments:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 "Prosthodontics and Crown & Bridge",
                 "Oral and Maxillofacial Surgery",
                 "Conservative Dentistry & Endodontics",
                 "Periodontology",
                 "Orthodontics & Dentofacial Orthopedics",
                 "Pediatric & Preventive Dentistry",
                 "Oral Medicine and Radiology",
                 "Oral Pathology and Microbiology"
               ].map((spec, i) => (
                 <div key={i} className="p-4 border rounded-md" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-main)' }}>
                    <div className="font-semibold text-primary">{spec}</div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'PHD' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <h2 className="text-3xl mb-6 text-primary flex items-center gap-3">
              <BookOpen color="var(--secondary)"/> Doctor of Philosophy (PhD)
            </h2>
            <p className="text-lg text-muted mb-8">
              RRDCH is a recognized research center under RGUHS. We offer advanced doctoral programs designed for candidates aiming to pursue extensive scientific research and academic excellence in dentistry.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card bg-gray-50 border-0 shadow-none">
                <h3 className="text-xl mb-4 flex items-center gap-2"><BookOpen size={18}/> PhD Program Details</h3>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Full-time & Part-time Options Available</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Duration: Minimum 3 Years</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Mandatory Pre-Ph.D Coursework</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Half-Yearly Progress Reports</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Dedicated Research Labs & Grants</li>
                </ul>
              </div>

              <div className="card bg-gray-50 border-0 shadow-none">
                <h3 className="text-xl mb-4 flex items-center gap-2"><Award size={18}/> Admission Criteria</h3>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Master’s Degree (MDS) recognized by DCI</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> RGUHS Ph.D Entrance Examination</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} color="var(--secondary)"/> Personal Interview & Synopsis Presentation</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        </div>
        </div>
        </div>
    </motion.div>
  );
};

export default Curriculum;
