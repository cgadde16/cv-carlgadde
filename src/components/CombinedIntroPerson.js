import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown'; 
import './Person.css';
import './IntroAnimation.css';
import { CiMail, CiLocationOn } from "react-icons/ci";
import LanguageSwitcherIcon from './LanguageSwitcherIcon';

function CombinedIntroPerson({ onAnimationComplete }) {
  const { t, i18n } = useTranslation();

  const name = t('person.name');
  const fullTitle = t('person.titleOrProfession');
  const location = t('person.location');
  const email = t('person.email');
  const bioShort = t('person.bioShort', { returnObjects: true }); 

  const [phase, setPhase] = useState('intro'); 
  const [nameAlwaysVisible, setNameAlwaysVisible] = useState(false);
  
  const [showHeader, setShowHeader] = useState(false);
  const [animatedSubtitle, setAnimatedSubtitle] = useState('');
  const [isTextAnimating, setIsTextAnimating] = useState(true);
  
  const [animatedTitle, setAnimatedTitle] = useState('');
  const [backgroundIsVisible, setBackgroundIsVisible] = useState(false);
  const [contentIsVisible, setContentIsVisible] = useState(false);
  const [nameIsVisible, setNameIsVisible] = useState(false);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);

  const loadingText = 'Loading Profile';
  const TYPING_SPEED = 40;

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    setShowHeader(true);
    setNameAlwaysVisible(true);
    
    setTimeout(() => {
      setNameIsVisible(true);
    }, 1500);
    
    let textTimeout;
    const INTRO_TYPING_SPEED = 20;
    const DOT_SPEED = 300;
    const DELETE_SPEED = 20;
    const PAUSE_AFTER_DOTS = 200;

    const typeText = (text, index, onComplete) => {
      if (index <= text.length) {
        setAnimatedSubtitle(text.substring(0, index));
        textTimeout = setTimeout(() => typeText(text, index + 1, onComplete), INTRO_TYPING_SPEED);
      } else {
        onComplete();
      }
    };

    const showDots = (count = 1) => {
      if (count <= 3) {
        setAnimatedSubtitle(`${loadingText}${'.'.repeat(count)}`);
        textTimeout = setTimeout(() => showDots(count + 1), DOT_SPEED);
      } else {
        textTimeout = setTimeout(() => {
          deleteText((loadingText.length + 3), () => {
            setAnimatedSubtitle('');
            setIsTextAnimating(false);
            textTimeout = setTimeout(() => {
              setPhase('person');
              document.body.style.overflow = originalStyle;
              document.body.style.position = originalPosition;
              document.body.style.width = '';
              document.body.style.height = '';
              startTitleAnimation();
            }, 300);
          });
        }, PAUSE_AFTER_DOTS);
      }
    };

    const deleteText = (index, onComplete) => {
      if (index >= 0) {
        setAnimatedSubtitle(prev => prev.substring(0, index));
        textTimeout = setTimeout(() => deleteText(index - 1, onComplete), DELETE_SPEED);
      } else {
        onComplete();
      }
    };

    textTimeout = setTimeout(() => {
      typeText(loadingText, 0, () => {
        setTimeout(() => {
          showDots();
        }, DOT_SPEED);
      });
    }, 500);

    return () => {
      clearTimeout(textTimeout);
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  const startTitleAnimation = () => {
    const checkAndStart = () => {
      const currentTitle = t('person.titleOrProfession');
      if (!currentTitle || currentTitle === 'person.titleOrProfession' || currentTitle.length === 0) {
        setTimeout(checkAndStart, 100);
        return;
      }

      let index = 0;
      const backgroundTriggerIndex = Math.floor(currentTitle.length * 0.01);
      const contentTriggerIndex = Math.floor(currentTitle.length * 0.7);

      const type = () => {
        if (index <= currentTitle.length) {
          if (index === backgroundTriggerIndex) {
            setBackgroundIsVisible(true);
          }

          if (index === contentTriggerIndex) {
            setContentIsVisible(true);
            setTimeout(() => {
              if (onAnimationComplete) {
                onAnimationComplete();
              }
            }, 600);
          }
          
          setAnimatedTitle(currentTitle.substring(0, index));
          index++;
          setTimeout(type, TYPING_SPEED);
        } else {
          setTitleAnimationComplete(true);
        }
      };
      
      setTimeout(type, 100);
    };
    
    checkAndStart();
  };

  useEffect(() => {
    if (phase === 'person' && titleAnimationComplete) {
      setAnimatedTitle(t('person.titleOrProfession'));
    }
  }, [i18n.language, phase, titleAnimationComplete, t]);

  return (
    <div className="person-page-container" style={{ position: 'relative', zIndex: 20 }}>
      {phase === 'intro' && (
        <div className="intro-overlay" style={{ zIndex: 25 }}>
          <div className="intro-top-section">
            <div className={`intro-header ${showHeader ? 'show' : ''} animated-header-container`}>
              <h1 className="intro-name animated-header-title">{name}</h1>
              <p className="intro-subtitle animated-header-subtitle">
                {animatedSubtitle || '\u00A0'}
              </p>
            </div>
          </div>
        </div>
      )}

      <header className={`person-hero-section ${backgroundIsVisible ? 'is-visible' : ''}`} 
          style={{ position: 'relative', zIndex: 21 }}>
        <div className="language-switcher-container">
          {backgroundIsVisible && <LanguageSwitcherIcon />}
        </div>
        
        <div className="person-hero-text animated-header-container">
          <h1 className={`animated-header-title person-name ${
            nameIsVisible ? 'show-immediately' : 'hidden'
          }`}>
            {name}
          </h1>
          <p className="person-hero-subtitle animated-header-subtitle">
            {phase === 'person' ? (animatedTitle || '\u00A0') : '\u00A0'}
          </p>
        </div>
      </header>
      
      <main className={`person-content-section ${contentIsVisible ? 'is-visible' : ''}`}
          style={{ position: 'relative', zIndex: 21 }}>
          
        <div className="about-me-container">
          <div className="section-headline">
            {t('person.aboutMeTitle')}
          </div>
          <div className="main-content">
            <div className="person-bio">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  )
                }}
              >
                {bioShort}
              </ReactMarkdown>
            </div>

            <div className="person-contact-info">
              {location && (
                <div className="person-info-item">
                  <CiLocationOn className="icon" />
                  <span>{location}</span>
                </div>
              )}
              {email && (
                <div className="person-info-item">
                  <CiMail className="icon" />
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CombinedIntroPerson;
