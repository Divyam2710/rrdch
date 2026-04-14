import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Activity, Beaker, Cross, HeartPulse, Stethoscope, Microscope, Search, ShieldPlus, Dna, Syringe, Sparkles, Smile, ChevronRight, CheckCircle } from 'lucide-react';

const departmentData = [
  { id: 'oral-medicine', title: 'Oral Medicine & Radiology', icon: <Search size={22}/>, color: '#4A5D52', data: 'Specializes in the clinical diagnosis of maxillofacial diseases and advanced dental imaging techniques (CBCT, OPG). Focuses on comprehensive patient examination, identifying oral manifestations of systemic diseases, and delivering non-surgical management pathways.' },
  { id: 'prosthetics', title: 'Prosthetics & Crown & Bridge', icon: <Sparkles size={22}/>, color: '#6B7D5E', data: 'Dedicated to the restoration and replacement of missing teeth through advanced prostheses. This includes full arches, complete dentures, fixed partial dentures, and complex maxillofacial prosthetics to restore optimal oral function and aesthetics.' },
  { id: 'oral-surgery', title: 'Oral & Maxillofacial Surgery', icon: <Syringe size={22}/>, color: '#5C3D2E', data: 'Handles complex surgical interventions including intricate tooth extractions, maxillofacial trauma repair, corrective jaw surgeries (orthognathic surgery), and surgical pathology. Supported by state-of-the-art minor and major operating theaters.' },
  { id: 'periodontology', title: 'Periodontology', icon: <ShieldPlus size={22}/>, color: '#2B6777', data: 'Focuses on the prevention, diagnosis, and treatment of diseases affecting the gums and supporting structures of teeth. Procedures range from scaling and root planing to advanced laser-assisted flap surgeries and soft tissue grafting.' },
  { id: 'pedodontics', title: 'Pedodontics & Preventive Dentistry', icon: <Smile size={22}/>, color: '#8B6914', data: 'Committed strictly to the oral health of children from infancy through the teenage years. Emphasizes early intervention, behavioral management, fluoride applications, space maintainers, and comprehensive interceptive orthodontics.' },
  { id: 'conservative', title: 'Conservative Dentistry & Endodontics', icon: <Cross size={22}/>, color: '#6B4C8C', data: 'Aims to preserve the natural tooth structure through restorative procedures. Specializes in advanced root canal treatments (Endodontics) using rotary instruments and operating microscopes to treat pulpal and periapical pathology.' },
  { id: 'orthodontics', title: 'Orthodontics & Dentofacial Orthopedics', icon: <Stethoscope size={22}/>, color: '#3D5A80', data: 'Corrects malocclusions, misaligned teeth, and disproportionate jaw relationships. Treatments include standard metal/ceramic braces, invisible aligner therapies, and complex dentofacial orthopedics for growing patients.' },
  { id: 'public-health', title: 'Public Health Dentistry', icon: <HeartPulse size={22}/>, color: '#CC5500', data: 'Extends dental care beyond the clinic walls through massive community outreach, mobile dental vans, and specialized oral health camps in rural regions. Focuses heavily on epidemiological research and preventive programs.' },
  { id: 'oral-pathology', title: 'Oral & Maxillofacial Pathology', icon: <Microscope size={22}/>, color: '#4A6741', data: 'The bedrock of dental diagnostics. Features comprehensive laboratory setups to analyze biopsies, bodily fluids, and tissues to diagnose oral cancers, cysts, and benign tumors at a microscopic level.' },
  { id: 'implantology', title: 'Implantology', icon: <Dna size={22}/>, color: '#2B3A31', data: 'A multidisciplinary super-specialty focusing on titanium dental implants. Features integrated workflows involving CBCT planning, customized abutments, and immediate-loading implant protocols to permanently replace missing teeth.' },
  { id: 'research', title: 'Research & Publication', icon: <Beaker size={22}/>, color: '#5B4B8A', data: 'Drives the academic frontier of RRDCH. This department manages institutional grants, oversees ICMR-approved multi-center studies, and guides post-graduate students in publishing their dissertations in high-impact international journals.' },
  { id: 'orofacial-pain', title: 'Orofacial Pain', icon: <Activity size={22}/>, color: '#7D4E57', data: 'A highly specialized niche dealing with the diagnosis and management of chronic facial pain disorders, Temporomandibular Joint (TMJ) dysfunction, and complex neurovascular pain syndromes impacting the oral cavity.' }
];

const coreFunctions = [
  'Advanced UG & PG Curriculum Delivery',
  'Extramural Research & Diagnostic Services',
  'Specialized Patient Care (OPD & IPD)',
  'Interdisciplinary Treatment Planning',
];

const Departments = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(departmentData[0].id);
  const activeDept = departmentData.find(d => d.id === activeTab);

  useEffect(() => {
    if (location.state && location.state.tab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(location.state.tab);
    }
  }, [location, location.state]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative" style={{ background: 'var(--primary)', padding: '5rem 0 4rem', overflow: 'hidden' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(188,163,127,0.2) 0%, transparent 60%)' }}></div>
        <div className="container relative text-center" style={{ zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: 'inline-block', background: 'rgba(188,163,127,0.15)', border: '1px solid rgba(188,163,127,0.3)', color: 'var(--secondary)', borderRadius: '999px', padding: '0.3rem 1.2rem', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              12 Specialized Disciplines
            </span>
            <h1 className="text-white" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
              Clinical <span style={{ background: 'linear-gradient(135deg, #BCA37F, #E6D5B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Departments</span>
            </h1>
            <p className="mx-auto" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.7 }}>
              Explore each of our world-class clinical departments, each equipped with cutting-edge diagnostic technology and led by internationally trained specialists.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Department Grid + Sidebar Layout */}
      <section className="py-16 bg-main">
        <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <div style={{ flex: '0 0 280px', minWidth: '220px', background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--primary)' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--secondary)', fontWeight: 600 }}>Select Department</span>
            </div>
            {departmentData.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.85rem 1.25rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === dept.id ? `${dept.color}12` : 'transparent',
                  borderLeft: activeTab === dept.id ? `4px solid ${dept.color}` : '4px solid transparent',
                  color: activeTab === dept.id ? dept.color : 'var(--text-muted)',
                  fontWeight: activeTab === dept.id ? 700 : 400,
                  fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)'
                }}
              >
                <span style={{ color: activeTab === dept.id ? dept.color : 'var(--text-muted)', opacity: 0.7, flexShrink: 0 }}>{dept.icon}</span>
                <span style={{ lineHeight: 1.3 }}>{dept.title}</span>
                {activeTab === dept.id && <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <AnimatePresence mode="wait">
              {activeDept && (
                <motion.div
                  key={activeDept.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Department Header Card */}
                  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '2.5rem 2.5rem 2rem', background: `linear-gradient(135deg, ${activeDept.color} 0%, ${activeDept.color}CC 100%)` }}>
                      <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(8px)', marginBottom: '1.5rem', color: 'white' }}>
                        {activeDept.icon}
                      </div>
                      <h2 style={{ color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.1, margin: 0 }}>{activeDept.title}</h2>
                    </div>
                    <div style={{ padding: '2rem 2.5rem', background: 'white' }}>
                      <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>{activeDept.data}</p>
                    </div>
                  </div>

                  {/* Core Functions */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {coreFunctions.map((fn, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1.25rem', background: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                        <CheckCircle size={18} color={activeDept.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500, lineHeight: 1.5 }}>{fn}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;
