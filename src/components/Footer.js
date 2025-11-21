import React from 'react';
import { useTranslation } from 'react-i18next';
import { CiMail } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci"; 
import { FaGithub } from "react-icons/fa";

const MY_EMAIL_ADDRESS = "carlgadde@proton.me";      
const LINKEDIN_URL = "https://www.linkedin.com/in/carl-gadde";
const GITHUB_URL = "https://github.com/cgadde16";       

const footerStyle = {
  textAlign: 'center',
  padding: '30px 20px',
  marginTop: '40px',
};

const socialIconsContainerStyle = {
  marginBottom: '20px', 
  display: 'flex',
  justifyContent: 'center',
  gap: '25px', 
};

const iconLinkStyle = {
  color: '#333', 
  textDecoration: 'none',
  fontSize: '1.8rem', 
  transition: 'color 0.3s ease, transform 0.2s ease', 
};

const iconLinkHoverStyle = {
  color: '#007bff', 
  transform: 'scale(1.15)', 
};


function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: `mailto:${MY_EMAIL_ADDRESS}`,
      IconComponent: CiMail, 
      labelKey: 'footer.iconAltEmail',
      defaultLabel: 'E-Mail senden',
    },
    {
      href: LINKEDIN_URL,
      IconComponent: CiLinkedin, 
      labelKey: 'footer.iconAltLinkedIn',
      defaultLabel: 'LinkedIn Profil',
    },
    {
      href: GITHUB_URL,
      IconComponent: FaGithub,
      labelKey: 'footer.iconAltGitHub',
      defaultLabel: 'GitHub Profil',
    },
  ];

  return (
    <footer style={footerStyle}>
      <div style={socialIconsContainerStyle}>
        {socialLinks.map((linkInfo, index) => (
          <a
            key={index}
            href={linkInfo.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(linkInfo.labelKey, linkInfo.defaultLabel)}
            title={t(linkInfo.labelKey, linkInfo.defaultLabel)} 
            style={iconLinkStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.color = iconLinkHoverStyle.color;
              e.currentTarget.style.transform = iconLinkHoverStyle.transform;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = iconLinkStyle.color;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >

            <linkInfo.IconComponent />
          </a>
        ))}
      </div>

      <p style={{ fontSize: '0.9em', color: '#6c757d', margin: 0 }}>
        {currentYear} - {t('footer.copyrightText')}
      </p>
    </footer>
  );
}

export default Footer;