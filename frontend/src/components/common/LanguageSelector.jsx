import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';

export function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  return (
    <div className="language-selector-wrap">
      <span className="lang-icon">🌐</span>
      <select
        className="language-select"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        title="Select Application Language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
}
