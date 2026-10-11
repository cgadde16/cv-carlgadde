import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import './TimelineEvents.css';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

const SLOT_ITEM_HEIGHT = 100;
const WHEEL_GESTURE_GAP = 150;
const FIXED_LOGO_WIDTH_DESKTOP = 250;

// Mouse wheels scroll in fixed notches (wheelDelta of 120 per notch, or line mode in Firefox).
// Trackpads report pixel deltas where wheelDeltaY is -3 × deltaY (Chrome, Edge, Safari).
const isMouseWheelEvent = (event) => {
  if (event.deltaMode !== 0) return true;
  if (typeof event.wheelDeltaY === 'number' && event.wheelDeltaY !== 0) {
    return Math.abs(Math.abs(event.wheelDeltaY) - 3 * Math.abs(event.deltaY)) > 2;
  }
  return false;
};

function TimelineEvents({ startAnimation }) {
  const { t } = useTranslation();

  const initialEvents = useMemo(() => {
    const events = t('timeline.events', { returnObjects: true });
    return Array.isArray(events) ? events : [];
  }, [t]);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [calculatedFontSize, setCalculatedFontSize] = useState('2.5em');
  const [sidebarReady, setSidebarReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const contentWrapperRef = useRef(null);
  const sidebarRef = useRef(null);
  const testElementRef = useRef(null);
  const wheelGestureRef = useRef({
    lastEventTime: 0, lastAbsDelta: 0, lastSign: 0, stepped: false, sawDecay: false, trough: Infinity, rising: 0,
  });
  const logoContainerRef = useRef(null);
  const textContentRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1750;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useLayoutEffect(() => {
    const textEl = textContentRef.current;
    if (!textEl) return;

    if (isMobile) {
      textEl.style.marginLeft = '0';
    } else { 
      textEl.style.marginLeft = `${FIXED_LOGO_WIDTH_DESKTOP + 32}px`; 
    }

    return () => {
      if (textEl) {
        textEl.style.marginLeft = '0';
      }
    };
  }, [currentEventIndex, isMobile]); 


  const calculateOptimalFontSize = useCallback(() => {
    if (!sidebarRef.current || !initialEvents || initialEvents.length === 0) {
        setCalculatedFontSize('2.5em'); 
        return;
    }
    if (!testElementRef.current) {
      testElementRef.current = document.createElement('div');
      testElementRef.current.style.position = 'absolute';
      testElementRef.current.style.left = '-9999px';
      testElementRef.current.style.top = '-9999px';
      testElementRef.current.style.whiteSpace = 'nowrap';
      
      let fontFamily = 'sans-serif';
      if (document.body) { 
        const bodyStyles = window.getComputedStyle(document.body);
        fontFamily = bodyStyles.getPropertyValue('font-family').split(',')[0].trim() || 'sans-serif';
        if (fontFamily.startsWith('"') && fontFamily.endsWith('"')) {
          fontFamily = fontFamily.substring(1, fontFamily.length -1);
        }
      }
      testElementRef.current.style.fontFamily = fontFamily;
      testElementRef.current.style.fontWeight = '700'; 
      testElementRef.current.style.padding = '0 8px';  
      document.body.appendChild(testElementRef.current);
    }
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const slotMachineWheelWidth = sidebarRect.width * 0.90; 
    const slotItemPaddingHorizontal = 8 * 2; 
    const netTextWidthInSlotItem = slotMachineWheelWidth - slotItemPaddingHorizontal;
    const targetTextWidth = netTextWidthInSlotItem * 0.80; 
    const longestTitle = initialEvents.reduce((longest, event) => {
      const title = event.sidebarTitle || event.title || "";
      return title.length > longest.length ? title : longest;
    }, '');
    if (!longestTitle) {
        setCalculatedFontSize('2em'); 
        return;
    }
    let minSize = 8;  
    let maxSize = SLOT_ITEM_HEIGHT * 0.9; 
    let optimalSize = minSize;
    for (let i = 0; i < 20; i++) { 
        const testSize = (minSize + maxSize) / 2;
        if (testSize <= 0) { 
            optimalSize = 1; 
            break;
        }
        testElementRef.current.style.fontSize = `${testSize}px`;
        testElementRef.current.textContent = longestTitle;
        const currentTestWidth = testElementRef.current.getBoundingClientRect().width;
        if (currentTestWidth <= targetTextWidth) {
            optimalSize = testSize;
            minSize = testSize; 
        } else {
            maxSize = testSize;
        }
        if (maxSize - minSize < 0.5) break; 
    }
    const practicalMaxFontSize = SLOT_ITEM_HEIGHT * 0.8; 
    optimalSize = Math.min(optimalSize, practicalMaxFontSize);
    const baseFontSizeForEm = 16; 
    const finalFontSize = `${(optimalSize / baseFontSizeForEm).toFixed(2)}em`;
    setCalculatedFontSize(finalFontSize);
  }, [initialEvents]);


  useEffect(() => {
    const updateLayout = () => {
      calculateOptimalFontSize();
      setTimeout(() => setSidebarReady(true), 50);
    };
    const timeoutId = setTimeout(updateLayout, 100); 
    window.addEventListener('resize', updateLayout);
    return () => {
      window.removeEventListener('resize', updateLayout);
      clearTimeout(timeoutId);
    }
  }, [calculateOptimalFontSize]);

  useEffect(() => {
    return () => {
      if (testElementRef.current && document.body.contains(testElementRef.current)) {
        document.body.removeChild(testElementRef.current);
        testElementRef.current = null; 
      }
    };
  }, []);

  const slotListTranslateY = useMemo(() => {
    if (!sidebarRef.current || initialEvents.length === 0 || !sidebarReady) return 0;
    const sidebarHeight = sidebarRef.current.offsetHeight;
    const sidebarCenter = sidebarHeight / 2;
    const itemTopPosition = currentEventIndex * SLOT_ITEM_HEIGHT;
    const itemCenterCorrection = SLOT_ITEM_HEIGHT / 2;
    return sidebarCenter - itemTopPosition - itemCenterCorrection;
  }, [currentEventIndex, initialEvents.length, sidebarReady]);

  const handleSidebarClick = useCallback((targetIndex) => {
    if (targetIndex >= 0 && targetIndex < initialEvents.length) {
      setCurrentEventIndex(targetIndex);
    }
  }, [initialEvents.length]);


  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (!isMobile) return;
    touchStartRef.current = e.targetTouches[0].clientX;
  }, [isMobile]);

  const handleTouchMove = useCallback((e) => {
    if (!isMobile) return;
    touchEndRef.current = e.targetTouches[0].clientX;
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isSwipeLeft = distance > 50;
    const isSwipeRight = distance < -50;

    if (isSwipeLeft && currentEventIndex < initialEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else if (isSwipeRight && currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [isMobile, currentEventIndex, initialEvents.length]);

  const handleWheel = useCallback((event) => {
    if (isMobile || initialEvents.length === 0) return;

    // Titles may overflow the timeline box on desktop; only hijack the wheel inside the box.
    const box = contentWrapperRef.current?.getBoundingClientRect();
    if (box && (event.clientY < box.top || event.clientY > box.bottom)) return;

    if (event.deltaY === 0) return;

    const targetIndex = currentEventIndex + (event.deltaY > 0 ? 1 : -1);
    const beyondEdge = targetIndex < 0 || targetIndex >= initialEvents.length;

    // Mouse wheel: every notch moves one entry; past the first/last entry the page scrolls.
    if (isMouseWheelEvent(event)) {
      if (beyondEdge) return;
      event.preventDefault();
      setCurrentEventIndex(targetIndex);
      return;
    }

    // Trackpads (e.g. on macOS) send a long stream of small wheel events per swipe, including a
    // momentum tail that can last over a second. Each swipe moves the timeline by one entry.
    // A new swipe is recognised by a pause, a change of direction, or deltas rising again after
    // they had been decaying (momentum only ever slows down; a new swipe builds up).
    const gesture = wheelGestureRef.current;
    const now = Date.now();
    const absDelta = Math.abs(event.deltaY);
    const sign = Math.sign(event.deltaY);

    if (absDelta < gesture.lastAbsDelta) {
      gesture.sawDecay = true;
      gesture.rising = 0;
      gesture.trough = Math.min(gesture.trough, absDelta);
    } else if (absDelta > gesture.lastAbsDelta) {
      gesture.rising += 1;
    }

    const isNewGesture =
      now - gesture.lastEventTime > WHEEL_GESTURE_GAP ||
      sign !== gesture.lastSign ||
      (gesture.sawDecay && gesture.rising >= 2 && absDelta >= Math.max(2 * gesture.trough, gesture.trough + 4));

    gesture.lastEventTime = now;
    gesture.lastAbsDelta = absDelta;
    gesture.lastSign = sign;
    if (isNewGesture) {
      gesture.stepped = false;
      gesture.sawDecay = false;
      gesture.trough = Infinity;
      gesture.rising = 0;
    }

    // Past the first/last entry a fresh gesture scrolls the page, but the rest of the
    // gesture that just reached that entry is swallowed so the page doesn't jump away.
    if (beyondEdge && !gesture.stepped) return;

    event.preventDefault();
    if (beyondEdge || gesture.stepped) return;

    gesture.stepped = true;
    setCurrentEventIndex(targetIndex);
  }, [currentEventIndex, initialEvents.length, isMobile]);

  useEffect(() => {
    const mainContainer = contentWrapperRef.current;
    if (mainContainer) {
      if (isMobile) {
        mainContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        mainContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        mainContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
      } else {
        mainContainer.addEventListener('wheel', handleWheel, { passive: false });
      }
    }

    return () => {
      if (mainContainer) {
        if (isMobile) {
          mainContainer.removeEventListener('touchstart', handleTouchStart);
          mainContainer.removeEventListener('touchmove', handleTouchMove);
          mainContainer.removeEventListener('touchend', handleTouchEnd);
        } else {
          mainContainer.removeEventListener('wheel', handleWheel);
        }
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, currentEventIndex, initialEvents.length, isMobile]);

  useEffect(() => {
    if (initialEvents.length > 0) {
      setCurrentEventIndex(prevIndex => Math.min(prevIndex, initialEvents.length - 1));
    } else {
      setCurrentEventIndex(0);
    }
  }, [initialEvents]);

  if (!initialEvents || initialEvents.length === 0) {
    return <div className="timeline-container" style={{justifyContent: 'center', alignItems: 'center', color: 'white'}}><p>{t('timeline.noEvents')}</p></div>;
  }

  const currentEventData = initialEvents[currentEventIndex];
  const dynamicSidebarStyle = { '--main-slot-font-size': calculatedFontSize };

  return (
    <div className={`timeline-container ${isMobile ? 'mobile' : 'desktop'}`} ref={contentWrapperRef}>
      <div className={`event-content-area ${startAnimation ? 'animate-in' : ''}`}>
        {currentEventData && (
          <div className="event-card active-event-card">
            <div ref={logoContainerRef} className="event-logo-container">
              {currentEventData.logo && (
                <img
                  src={process.env.PUBLIC_URL + currentEventData.logo}
                  alt={`${currentEventData.title} logo`}
                  className="event-logo"
                />
              )}
            </div>
            <div ref={textContentRef} className="event-text-content">
              <h2>{currentEventData.title}</h2>
              <h3>{currentEventData.subtitle}</h3>
              <p className="event-date">{currentEventData.date}</p>
              <ReactMarkdown>{currentEventData.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div 
        className={`titles-sidebar ${startAnimation ? 'animate-in' : ''}`} 
        ref={sidebarRef} 
        style={dynamicSidebarStyle}
      >
        {isMobile ? (
          <div className="mobile-tabs-container">
            <div className="mobile-tabs-wrapper">
              {initialEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`mobile-tab ${index === currentEventIndex ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(index)}
                >
                  <div className="tab-title">
                    {event.sidebarTitle || event.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="titles-list-wrapper">
            <div
              className="slot-list"
              style={{ 
                transform: `translateY(${slotListTranslateY}px)`,
                opacity: sidebarReady ? 1 : 0,
                transition: sidebarReady ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease' : 'none'
              }}
            >
              {initialEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`slot-item ${index === currentEventIndex ? 'current' : ''}`}
                  onClick={() => handleSidebarClick(index)}
                  role="button"
                  tabIndex={0}
                >
                  {event.sidebarTitle || event.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineEvents;