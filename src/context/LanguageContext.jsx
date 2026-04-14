import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const fallbackTranslations = {
  en: {
    home: "Home",
    about: "About Us",
    admissions: "Admissions",
    departments: "Departments",
    patientPortal: "Patient Portal",
    studentDashboard: "Student Dashboard",
    admin: "Admin",
    bookAppointment: "Book Appointment",
    collegeName: "Rajarajeswari Dental College & Hospital"
  },
  kn: {
    home: "ಮುಖ್ಯಪುಟ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    admissions: "ಪ್ರವೇಶಾತಿ",
    departments: "ವಿಭಾಗಗಳು",
    patientPortal: "ರೋಗಿಗಳ ಪೋರ್ಟಲ್",
    studentDashboard: "ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    admin: "ಆಡಳಿತ",
    bookAppointment: "ನೇಮಕಾತಿ ಕಾಯ್ದಿರಿಸಿ",
    collegeName: "ರಾಜರಾಜೇಶ್ವರಿ ದಂತ ಕಾಲೇಜು ಮತ್ತು ಆಸ್ಪತ್ರೆ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => fallbackTranslations[lang][key] || key;

  const toggleLanguage = () => {
    if (lang === 'en') {
      // Switching to Kannada: Trigger Google Translate
      setLang('kn');
      setTimeout(() => {
        try {
          const selectElement = document.querySelector('.goog-te-combo');
          if (selectElement) {
            selectElement.value = 'kn';
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch (err) {
          console.error("Translation switch failed:", err);
        }
      }, 100);
    } else {
      // Switching back to English: Destroy the translation and restore exactly what you wrote
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
