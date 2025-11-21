import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSkills.css';

function LanguageSkills() {
  const { t } = useTranslation();
  const [animateLanguageBars, setAnimateLanguageBars] = useState(false);
  const sectionRef = useRef(null);

  const languageSkillsList = t('skills.languageSkills', { returnObjects: true, defaultValue: [] });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateLanguageBars(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getLevelClass = (proficiency) => {
    if (proficiency >= 90) return 'level-1';
    if (proficiency >= 75) return 'level-2';
    if (proficiency >= 60) return 'level-3';
    if (proficiency >= 40) return 'level-4';
    return 'level-5';
  };

  return (
    <section id="languages" className="language-section" ref={sectionRef}>
      <div className="language-container">
        <h3 className="section-headline">{t('skills.languageHeadline', 'Sprachkenntnisse')}</h3>
        {Array.isArray(languageSkillsList) && languageSkillsList.length > 0 ? (
          <ul className="language-skills-list">
            {languageSkillsList.map((skill, index) => (
              <li key={`language-${index}`} className="language-skill-item">
                <div className="language-info">
                  <span className="language-name">{skill.language}</span>
                  <span className="language-level-text">{skill.level}</span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className={`progress-bar-fill ${getLevelClass(skill.proficiency)}`}
                    style={{
                      width: animateLanguageBars ? `${skill.proficiency}%` : '0%',
                      transitionDelay: animateLanguageBars ? `${index * 0.15}s` : '0s',
                    }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t('skills.noLanguageSkills', 'Keine Sprachkenntnisse angegeben.')}</p>
        )}
      </div>
    </section>
  );
}

export default LanguageSkills;