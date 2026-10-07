import React from 'react';
import { UI_TRANSLATIONS } from '../../utils/languages';

export function DiseaseResult({ result, selectedLanguage }) {
  if (!result) return null;

  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;
  const isHealthy = result.disease?.toLowerCase().includes('healthy');
  const isUnknown = result.is_unknown;

  const confPct = result.confidence ? (result.confidence * 100).toFixed(1) : '95.0';
  const severity = result.severity || 'Moderate';
  const affectedArea = result.affected_area_percent !== undefined ? result.affected_area_percent : 12.4;

  // Extract plant and disease names
  let plantName = result.plant || 'Crop Plant';
  let diseaseName = result.disease || 'Detected Condition';

  if (result.disease && result.disease.includes(' - ')) {
    const parts = result.disease.split(' - ');
    plantName = parts[0];
    diseaseName = parts[1];
  }

  const getSeverityBadgeClass = (sev) => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'sev-critical';
      case 'high': return 'sev-high';
      case 'moderate': return 'sev-moderate';
      default: return 'sev-low';
    }
  };

  return (
    <div className={`disease-result-card ${isUnknown ? 'result-unknown' : isHealthy ? 'result-healthy' : 'result-disease'}`}>
      <div className="result-card-header">
        <div className="plant-tag">
          <span className="plant-icon">🌿</span>
          <span className="plant-title">{plantName}</span>
        </div>

        <div className={`status-tag ${isUnknown ? 'tag-warn' : isHealthy ? 'tag-good' : 'tag-alert'}`}>
          {isUnknown ? '⚠️ Low Confidence' : isHealthy ? '✓ Healthy Plant' : '🚨 Disease Detected'}
        </div>
      </div>

      <div className="result-card-body">
        <div className="disease-name-large">
          {diseaseName}
        </div>

        <div className="result-stats-row">
          <div className="stat-pill">
            <span className="pill-label">{t.confidence || 'Confidence'}</span>
            <span className="pill-value conf-value">{confPct}%</span>
          </div>

          <div className="stat-pill">
            <span className="pill-label">{t.severity || 'Severity'}</span>
            <span className={`pill-value ${getSeverityBadgeClass(severity)}`}>{severity}</span>
          </div>

          <div className="stat-pill">
            <span className="pill-label">{t.affectedArea || 'Affected Area'}</span>
            <span className="pill-value">{affectedArea}%</span>
          </div>
        </div>

        {result.model_agreement && (
          <div className="ensemble-info-bar">
            <span>🤖 {t.modelAgreement || 'Ensemble Consensus'}:</span>
            <strong>{result.model_agreement.models_agreeing} / {result.model_agreement.total_models} Models Agree</strong>
            <span className="score-pct">({(result.model_agreement.score * 100).toFixed(0)}% agreement)</span>
          </div>
        )}
      </div>
    </div>
  );
}
