import React from 'react';
import { t } from '../../i18n';

export function StatsBar({ stats, isStreamActive, selectedLanguage }) {
  return (
    <div className="ps-stats-bar">
      <div className="ps-stat-item">
        <div className="ps-stat-icon green">🤖</div>
        <div>
          <div className="ps-stat-val">{isStreamActive ? (t(selectedLanguage, 'start') === 'Start' ? 'Live' : 'Active') : 'Ready'}</div>
          <div className="ps-stat-label">{t(selectedLanguage, 'liveModel')}</div>
        </div>
      </div>
      <div className="ps-stat-item">
        <div className="ps-stat-icon red">⚠️</div>
        <div>
          <div className="ps-stat-val">{stats.critical_alerts ?? 0}</div>
          <div className="ps-stat-label">{t(selectedLanguage, 'criticalAlerts')}</div>
        </div>
      </div>
      <div className="ps-stat-item">
        <div className="ps-stat-icon amber">🔬</div>
        <div>
          <div className="ps-stat-val">{stats.total_detections ?? 0}</div>
          <div className="ps-stat-label">{t(selectedLanguage, 'totalDetections')}</div>
        </div>
      </div>
      <div className="ps-stat-item">
        <div className="ps-stat-icon blue">📡</div>
        <div>
          <div className="ps-stat-val">{isStreamActive ? 1 : 0}</div>
          <div className="ps-stat-label">{t(selectedLanguage, 'activeStreams')}</div>
        </div>
      </div>
    </div>
  );
}
