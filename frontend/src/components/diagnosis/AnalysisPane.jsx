import React, { useState } from 'react';
import { t, translateDiseaseName } from '../../i18n';

export function AnalysisPane({ result, analysisData, isLoading, selectedLanguage }) {
  const [tab, setTab] = useState('overview');

  const TABS = [
    { id: 'overview',   icon: '🌱', label: t(selectedLanguage, 'overview') },
    { id: 'cause',      icon: '🦠', label: t(selectedLanguage, 'cause') },
    { id: 'treatment',  icon: '💊', label: t(selectedLanguage, 'treatment') },
    { id: 'prevention', icon: '🛡', label: t(selectedLanguage, 'prevention') },
  ];

  const sevClass = () => {
    if (!result) return '';
    const s = (result.severity || '').toLowerCase();
    return s.includes('high') || s.includes('severe') ? 'high' : s.includes('mod') ? 'moderate' : 'healthy';
  };

  const confPct = result ? Math.round((result.confidence || 0) * 100) : 0;
  const isHealthy = result?.disease?.toLowerCase().includes('healthy');
  const isNonPlant = result?.is_plant === false || result?.disease?.toLowerCase().includes('no supported plant');
  const translatedTitle = translateDiseaseName(result?.disease, selectedLanguage);

  return (
    <div className="ps-analysis-pane">
      {/* Result Card */}
      {result ? (
        <div className="ps-result-card">
          <div className="ps-result-card-top">
            <div className="ps-result-header">
              <div>
                <div className="ps-result-label">{t(selectedLanguage, 'detectionResult')}</div>
                <div className="ps-result-disease" style={{color: isNonPlant ? '#E74C3C' : 'var(--text-1)'}}>
                  {translatedTitle || t(selectedLanguage, 'analyzing')}
                </div>
              </div>
              <span className={`ps-sev-badge ${isNonPlant ? 'high' : sevClass()}`}>
                {isNonPlant ? t(selectedLanguage, 'noSupportedPlant') : result.severity || 'Normal'}
              </span>
            </div>
            {!isNonPlant && (
              <div className="ps-result-conf-row">
                <div className="ps-result-conf-bar">
                  <div
                    className={`ps-result-conf-fill ${confPct > 80 && !isHealthy ? 'danger' : confPct > 60 ? 'warn' : ''}`}
                    style={{ width: `${confPct}%` }}
                  />
                </div>
                <span className="ps-result-conf-pct">{confPct}%</span>
              </div>
            )}
          </div>

          <div className="ps-result-meta-row">
            {result.affected_area_percent > 0 && (
              <span className="ps-meta-chip">📍 {result.affected_area_percent?.toFixed(1)}% area</span>
            )}
            {result.model_agreement && !isNonPlant && (
              <span className="ps-meta-chip">
                🤝 {result.model_agreement.models_agreeing}/{result.model_agreement.total_models} {t(selectedLanguage, 'modelsAgree')}
              </span>
            )}
            {result.is_unknown && !isNonPlant && (
              <span className="ps-meta-chip" style={{color:'#C0392B'}}>⚠ {t(selectedLanguage, 'lowConfidence')}</span>
            )}
            {result.gate_reason && isNonPlant && (
              <span className="ps-meta-chip" style={{color:'#C0392B'}}>⚠ {result.gate_reason}</span>
            )}
          </div>

          {/* Model Consensus Breakdown */}
          {result.models && Object.keys(result.models).length > 0 && !isNonPlant && (
            <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--border-light)'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'var(--text-3)',marginBottom:6,textTransform:'uppercase'}}>
                {t(selectedLanguage, 'modelsBreakdown')}:
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {Object.entries(result.models).map(([k, m]) => (
                  <span key={k} style={{fontSize:'11px',padding:'3px 8px',borderRadius:4,background:'var(--bg-2)',border:'1px solid var(--border-light)',color:'var(--text-2)'}}>
                    <strong>{m.name}:</strong> {translateDiseaseName(m.disease, selectedLanguage)} ({Math.round(m.confidence * 100)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="ps-genai-empty">
          <span className="ge-icon">🔬</span>
          <div className="ge-title">{t(selectedLanguage, 'noDetectionYet')}</div>
          <div className="ge-sub">{t(selectedLanguage, 'noDetectionSub')}</div>
        </div>
      )}

      {/* GenAI Loading State */}
      {isLoading && (
        <div className="ps-genai-loading">
          <div className="ps-genai-loading-header">
            <span className="ps-spinner" />
            <span style={{fontSize:'12px',color:'var(--text-3)'}}>{t(selectedLanguage, 'generatingAI')}</span>
          </div>
          {[100,80,65,90,55].map((w,i) => (
            <div key={i} className={`ps-skeleton ps-skeleton-line`} style={{width:`${w}%`}} />
          ))}
        </div>
      )}

      {/* GenAI Content Panel */}
      {!isLoading && analysisData && !isNonPlant && (
        <div className="ps-result-card" style={{overflow:'hidden'}}>
          {/* Sub-tabs */}
          <div className="ps-genai-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`ps-genai-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="ps-genai-content">
            {tab === 'overview' && (
              <>
                <div>
                  <div className="ps-genai-section-title">{t(selectedLanguage, 'whatIsDisease')}</div>
                  <div style={{fontSize:'13px',lineHeight:'1.65',color:'var(--text-2)'}}>{analysisData.explanation}</div>
                </div>
                {analysisData.symptoms?.length > 0 && (
                  <div>
                    <div className="ps-genai-section-title">{t(selectedLanguage, 'keySymptoms')}</div>
                    <ul className="ps-genai-list">
                      {analysisData.symptoms.map((s, i) => (
                        <li key={i}>
                          <span className="ps-list-bullet">✓</span>
                          <span style={{fontSize:'12.5px'}}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {tab === 'cause' && (
              <>
                <div>
                  <div className="ps-genai-section-title">{t(selectedLanguage, 'rootCause')}</div>
                  <div style={{fontSize:'13px',lineHeight:'1.65',color:'var(--text-2)'}}>{analysisData.cause}</div>
                </div>
                {analysisData.spread_conditions && (
                  <div>
                    <div className="ps-genai-section-title">{t(selectedLanguage, 'spreadConditions')}</div>
                    <div style={{fontSize:'12.5px',lineHeight:'1.65',color:'var(--text-2)',background:'var(--amber-bg)',padding:'10px 12px',borderRadius:'var(--radius-sm)',border:'1px solid rgba(212,121,10,0.15)'}}>
                      {analysisData.spread_conditions}
                    </div>
                  </div>
                )}
              </>
            )}

            {tab === 'treatment' && (
              <>
                {analysisData.treatment?.length > 0 && (
                  <div>
                    <div className="ps-genai-section-title">{t(selectedLanguage, 'treatmentSteps')}</div>
                    <ul className="ps-genai-list">
                      {analysisData.treatment.map((tr, i) => (
                        <li key={i}>
                          <span className="ps-list-bullet amber">{i+1}</span>
                          <span style={{fontSize:'12.5px'}}>{tr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisData.natural_remedies?.length > 0 && (
                  <div>
                    <div className="ps-genai-section-title">{t(selectedLanguage, 'organicRemedies')}</div>
                    <ul className="ps-genai-list">
                      {analysisData.natural_remedies.map((r, i) => (
                        <li key={i}>
                          <span className="ps-list-bullet" style={{fontSize:'11px'}}>🍃</span>
                          <span style={{fontSize:'12.5px'}}>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="ps-safety-banner">
                  <span>⚠️</span>
                  <div>{t(selectedLanguage, 'safetyNotice')}</div>
                </div>
              </>
            )}

            {tab === 'prevention' && (
              <>
                {analysisData.prevention?.length > 0 && (
                  <div>
                    <div className="ps-genai-section-title">{t(selectedLanguage, 'prevention')}</div>
                    <ul className="ps-genai-list">
                      {analysisData.prevention.map((p, i) => (
                        <li key={i}>
                          <span className="ps-list-bullet shield">🛡</span>
                          <span style={{fontSize:'12.5px'}}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisData.action_plan && (
                  <div>
                    <div className="ps-genai-section-title">{t(selectedLanguage, 'actionPlan')}</div>
                    <div className="ps-timeline">
                      {[
                        {dot:'today', label: t(selectedLanguage, 'today'), text: analysisData.action_plan.today},
                        {dot:'soon',  label: t(selectedLanguage, 'next3Days'), text: analysisData.action_plan.next_3_days},
                        {dot:'later', label: t(selectedLanguage, 'next2Weeks'), text: analysisData.action_plan.next_2_weeks},
                      ].filter(s => s.text).map((s, i) => (
                        <div key={i} className="ps-timeline-step">
                          <div className={`ps-timeline-dot ${s.dot}`}>{i+1}</div>
                          <div className="ps-timeline-body">
                            <div className="ps-timeline-label">{s.label}</div>
                            <div className="ps-timeline-text">{s.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
