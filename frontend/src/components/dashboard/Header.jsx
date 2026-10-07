import React from 'react';
import { SUPPORTED_LANGUAGES, t } from '../../i18n';

export function Header({
  healthStatus,
  modelStatus,
  selectedLanguage,
  onLanguageChange,
  onMenuToggle,
  activeNavTab,
  onNavTabChange
}) {
  // Determine real status
  const backendOnline = healthStatus?.backend === true || modelStatus?.status === 'ready';
  const modelsLoaded = modelStatus?.status === 'ready' || healthStatus?.models === true;
  const llmReady = healthStatus?.llm === true;

  let statusClass = 'loading';
  let statusText = t(selectedLanguage, 'connecting');

  if (healthStatus === null && modelStatus === null) {
    statusClass = 'loading';
    statusText = t(selectedLanguage, 'connecting');
  } else if (!backendOnline) {
    statusClass = 'error';
    statusText = t(selectedLanguage, 'offline');
  } else if (modelsLoaded && llmReady) {
    statusClass = 'ready';
    statusText = t(selectedLanguage, 'aiReady');
  } else if (modelsLoaded && !llmReady) {
    statusClass = 'ready';
    statusText = t(selectedLanguage, 'aiDegraded');
  } else {
    statusClass = 'error';
    statusText = t(selectedLanguage, 'offline');
  }

  return (
    <nav className="ps-nav">
      <button className="ps-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">☰</button>

      <div className="ps-nav-brand">
        <div className="ps-nav-logo">🌿</div>
        <span className="ps-nav-name">{t(selectedLanguage, 'appTitle')}</span>
      </div>

      <div className="ps-nav-tabs">
        <button
          className={`ps-nav-tab ${activeNavTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavTabChange && onNavTabChange('dashboard')}
        >
          {t(selectedLanguage, 'dashboard')}
        </button>
        <button
          className={`ps-nav-tab ${activeNavTab === 'inspections' ? 'active' : ''}`}
          onClick={() => onNavTabChange && onNavTabChange('inspections')}
        >
          {t(selectedLanguage, 'inspections')}
        </button>
        <button
          className={`ps-nav-tab ${activeNavTab === 'reports' ? 'active' : ''}`}
          onClick={() => onNavTabChange && onNavTabChange('reports')}
        >
          {t(selectedLanguage, 'reports')}
        </button>
      </div>

      <div className="ps-nav-right">
        <div className="ps-status-badge">
          <span className={`ps-status-dot ${statusClass}`} />
          <span>{statusText}</span>
        </div>
        <select
          className="ps-lang-select"
          value={selectedLanguage}
          onChange={e => onLanguageChange(e.target.value)}
        >
          {SUPPORTED_LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </nav>
  );
}
