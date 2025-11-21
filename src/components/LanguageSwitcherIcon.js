import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcherIcon() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage.startsWith('de') ? 'en' : 'de';
    i18n.changeLanguage(newLang);
  };

  let iconJsx;
  let buttonTitle;

  const flagImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: 'inherit',
  };

  if (currentLanguage.startsWith('de')) {
    iconJsx = (
      <img
        src="https://flagcdn.com/gb.svg"
        alt={t('switchToEnglish', "Switch to English")}
        style={flagImageStyle}
      />
    );
    buttonTitle = t('switchToEnglish', "Switch to English");
  } else {
    iconJsx = (
      <img
        src="https://flagcdn.com/de.svg"
        alt={t('switchToGerman', "Auf Deutsch umstellen")}
        style={flagImageStyle}
      />
    );
    buttonTitle = t('switchToGerman', "Auf Deutsch umstellen");
  }

  return (
    <button
      onClick={toggleLanguage}
      style={{
        width: '50px',
        height: '35px',
        borderRadius: '5px',
        background: 'none',
        border: '1px solid #ccc',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label={buttonTitle}
      title={buttonTitle}
    >
      {iconJsx}
    </button>
  );
}

export default LanguageSwitcherIcon;