import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css'; 
import './components/laptop-styles.css'
import './components/shared-styles.css'
import TimelineEvents from './components/TimelineEvents';
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import LanguageSkills from "./components/LanguageSkills"
import BinaryRain from "./components/BinaryRain";
import CombinedIntroPerson from "./components/CombinedIntroPerson"; 
import Projects2 from"./components/Projects2";

function App() {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    document.title = t('pageTitle');
  }, [t, i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [personAnimationDone, setPersonAnimationDone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handlePersonAnimationComplete = () => {
    console.log("Person animation finished. Starting TimelineEvents animation.");
    setPersonAnimationDone(true);
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  return (
    <div className="App">
      <BinaryRain />
      
      <CombinedIntroPerson onAnimationComplete={handlePersonAnimationComplete} />
      
      <div style={{ 
        position: 'relative', 
        zIndex: contentVisible ? 10 : -1
      }}>
        <TimelineEvents startAnimation={personAnimationDone} />
        <Projects2 />
        
        
        <Skills />
        <Footer />
      </div>
    </div>
  );
}

export default App;