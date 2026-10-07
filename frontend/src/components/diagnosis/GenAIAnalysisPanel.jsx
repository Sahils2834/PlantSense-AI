import React, { useState } from 'react';
import { UI_TRANSLATIONS } from '../../utils/languages';

export function GenAIAnalysisPanel({ analysisData, isLoading, selectedLanguage }) {
  const [activeTab, setActiveTab] = useState('overview');
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  if (isLoading) {
    return (
      <div className="genai-panel-loading">
        <div className="spinner"></div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#38bdf8' }}>
            ⚡ GenAI Agricultural Intelligence Engine Running...
          </div>
          <div style={{ fontSize: '12px', color: '#8fa896', marginTop: '4px' }}>
            {t.analyzingSub || 'Analyzing disease pathology, symptoms, organic remedies & prevention plan...'}
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <div className="genai-analysis-card">
      <div className="panel-header-bar">
        <div className="panel-title">
          <span>🤖</span>
          <span>GenAI Agricultural Disease Intelligence</span>
        </div>
        <div className="ai-badge">Grounded AI Analysis</div>
      </div>

      {/* Tabs Row */}
      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🌱 {t.overviewTab || 'Overview & Symptoms'}
        </button>
        <button
          className={`tab-btn ${activeTab === 'cause' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('cause')}
        >
          🦠 {t.causeTab || 'Cause & Spread'}
        </button>
        <button
          className={`tab-btn ${activeTab === 'treatment' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('treatment')}
        >
          💊 {t.treatmentTab || 'Treatment & Organic Remedies'}
        </button>
        <button
          className={`tab-btn ${activeTab === 'prevention' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('prevention')}
        >
          🛡 {t.preventionTab || 'Prevention & Action Plan'}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="panel-body-content">
        {activeTab === 'overview' && (
          <div className="tab-section">
            <div className="section-block">
              <h4 className="section-heading">🌿 {t.whatIsDisease || 'What is this disease?'}</h4>
              <p className="text-content">{analysisData.explanation}</p>
            </div>

            <div className="section-block">
              <h4 className="section-heading">🔍 {t.keySymptoms || 'Key Symptoms'}</h4>
              <ul className="symptoms-list">
                {analysisData.symptoms?.map((sym, idx) => (
                  <li key={idx} className="symptom-item">
                    <span className="bullet-icon">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'cause' && (
          <div className="tab-section">
            <div className="section-block">
              <h4 className="section-heading">🦠 {t.rootCause || 'Root Cause & Environmental Triggers'}</h4>
              <p className="text-content">{analysisData.cause}</p>
            </div>

            {analysisData.spread_conditions && (
              <div className="section-block">
                <h4 className="section-heading">🌧 Weather & Conditions Favoring Spread</h4>
                <div className="info-box-highlight">
                  {analysisData.spread_conditions}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="tab-section">
            <div className="section-block">
              <h4 className="section-heading">💊 {t.treatmentGuidance || 'Treatment Guidance'}</h4>
              <ul className="treatment-list">
                {analysisData.treatment?.map((trt, idx) => (
                  <li key={idx} className="treatment-item">
                    <span className="check-icon">✓</span>
                    <span>{trt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {analysisData.natural_remedies && analysisData.natural_remedies.length > 0 && (
              <div className="section-block">
                <h4 className="section-heading">🌿 Natural & Organic Remedies</h4>
                <ul className="remedy-list">
                  {analysisData.natural_remedies.map((rem, idx) => (
                    <li key={idx} className="remedy-item">
                      <span className="leaf-bullet">🍃</span>
                      <span>{rem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Disclaimer */}
            <div className="safety-warning-banner">
              <span className="warn-icon">⚠️</span>
              <div>
                <strong>Chemical Treatment & Dosage Safety Disclaimer:</strong> Chemical selection, dosage, and application frequency must strictly follow local agricultural officer advice and product label instructions.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prevention' && (
          <div className="tab-section">
            <div className="section-block">
              <h4 className="section-heading">🛡 {t.howToPrevent || 'How to Prevent Future Outbreaks'}</h4>
              <ul className="prevention-list">
                {analysisData.prevention?.map((prevItem, idx) => (
                  <li key={idx} className="prevention-item">
                    <span className="shield-bullet">🛡</span>
                    <span>{prevItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {analysisData.action_plan && (
              <div className="section-block">
                <h4 className="section-heading">📅 Farmer 3-Step Action Plan</h4>
                <div className="action-plan-timeline">
                  <div className="plan-step step-today">
                    <div className="step-badge">TODAY</div>
                    <div className="step-desc">{analysisData.action_plan.today}</div>
                  </div>
                  <div className="plan-step step-3days">
                    <div className="step-badge">NEXT 3 DAYS</div>
                    <div className="step-desc">{analysisData.action_plan.next_3_days}</div>
                  </div>
                  <div className="plan-step step-2weeks">
                    <div className="step-badge">NEXT 1-2 WEEKS</div>
                    <div className="step-desc">{analysisData.action_plan.next_2_weeks}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
