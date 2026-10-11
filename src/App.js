import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './components/laptop-styles.css'
import './components/shared-styles.css'
import TimelineEvents from './components/TimelineEvents';
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import BinaryRain from "./components/BinaryRain";
import CombinedIntroPerson from "./components/CombinedIntroPerson";
import Research from "./components/Research";

function App() {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    document.title = t('pageTitle');
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [personAnimationDone, setPersonAnimationDone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handlePersonAnimationComplete = () => {
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
        <Research />
        <Skills />
        <Footer />
      </div>
    </div>
  );
}

export default App;