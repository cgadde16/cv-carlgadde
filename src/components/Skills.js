import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './Skills.css';

import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub, FaFigma,
  FaCamera, FaHiking, FaUtensils, FaGamepad, FaBookOpen, FaQuestionCircle 
} from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiLibreofficedraw } from "react-icons/si";
import { CiTextAlignCenter } from "react-icons/ci";
import { RiBox3Fill } from "react-icons/ri";
import { IoMdFingerPrint } from "react-icons/io";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { FaSkiing } from "react-icons/fa";
import { IoBicycle } from "react-icons/io5";
import { SiWireshark } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { PiNetwork } from "react-icons/pi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TiVendorMicrosoft } from "react-icons/ti";
import { IoHardwareChipOutline } from "react-icons/io5";



import LanguageSkills from './LanguageSkills';


const iconMap = {
  FaReact: <FaReact />, IoLogoJavascript: <IoLogoJavascript />, FaNodeJs: <FaNodeJs />,
  FaHtml5: <FaHtml5 />, FaCss3Alt: <FaCss3Alt />, FaGithub: <FaGithub />,
  FaFigma: <FaFigma />, SiLibreofficedraw: <SiLibreofficedraw />, CiTextAlignCenter: <CiTextAlignCenter />,
  RiBox3Fill: <RiBox3Fill />, IoMdFingerPrint: <IoMdFingerPrint />,
  FaCamera: <FaCamera />, FaHiking: <FaHiking />, FaUtensils: <FaUtensils />,
  FaGamepad: <FaGamepad />, FaBookOpen: <FaBookOpen />, GiFullMotorcycleHelmet : <GiFullMotorcycleHelmet />, FaSkiing : <FaSkiing />, IoBicycle: <IoBicycle />, SiWireshark: <SiWireshark />, FaPython: <FaPython />, PiNetwork: <PiNetwork />, FaMagnifyingGlass:
<FaMagnifyingGlass />, TiVendorMicrosoft: <TiVendorMicrosoft />, IoHardwareChipOutline: <IoHardwareChipOutline />


};

const getIcon = (iconName) => iconMap[iconName] || <FaQuestionCircle />;

function Skills() {
  const { t } = useTranslation();

  const softwareSkillsObject = t('skills.softwareSkills', { returnObjects: true, defaultValue: {} });
  const hobbiesList = t('skills.hobbiesList', { returnObjects: true, defaultValue: [] });

  return (
    <section id="skills" className="skills-section">
       <LanguageSkills />
      <div className="skills-main-container">
       
        <div className="skills-header">
          <h3 className="section-headline">{t('skills.softwareHeadline', 'Softwarekenntnisse')}</h3>
        </div>
        
        <div className="skills-content">
          <div className="skill-category">
            {Object.keys(softwareSkillsObject).length > 0 ? (
              <div className="software-skills-grid">
                {Object.entries(softwareSkillsObject).map(([category, skills]) => (
                  <React.Fragment key={category}>
                    <div className="skill-subcategory-title">{category}</div>
                    <div className="skill-entries">
                      {skills.map((skill, index) => (
                        <div 
                          key={`software-${index}`} 
                          className="software-skill-item"
                        >
                          {getIcon(skill.icon)}
                          <span>{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p>{t('skills.noSoftwareSkills', 'Keine Softwarekenntnisse angegeben.')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="hobbies-container">
        <div className="hobbies-section">
          <h3 className="section-headline">{t('skills.hobbiesHeadline', 'Hobbies & Interessen')}</h3>
          {Array.isArray(hobbiesList) && hobbiesList.length > 0 ? (
            <div className="hobbies-grid">
              {hobbiesList.map((hobby, index) => (
                <div 
                  key={`hobby-${index}`} 
                  className="hobby-item"
                >
                  <div className="hobby-icon">
                    {getIcon(hobby.icon)}
                  </div>
                  <span className="hobby-name">{hobby.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>{t('skills.noHobbies', 'Keine Hobbies angegeben.')}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Skills;