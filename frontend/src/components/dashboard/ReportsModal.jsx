import React from 'react';
import { t, translateDiseaseName } from '../../i18n';

export function ReportsModal({ isOpen, onClose, selectedLanguage, alerts, stats, modelStatus }) {
  if (!isOpen) return null;

  return (
    <div className="ps-mobile-overlay show" style={{display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:20}} onClick={onClose}>
      <div
        className="ps-result-card"
        style={{maxWidth:680,width:'100%',maxHeight:'85vh',overflowY:'auto',background:'var(--bg-card)',padding:24,position:'relative'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,borderBottom:'1px solid var(--border-light)',paddingBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:'22px'}}>📋</span>
            <span style={{fontSize:'18px',fontWeight:700,color:'var(--text-1)'}}>
              {t(selectedLanguage, 'inspectionReports')}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{background:'none',border:'none',fontSize:'18px',color:'var(--text-3)',cursor:'pointer'}}
          >
            ✕
          </button>
        </div>

        {/* Summary Statistics */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:12,marginBottom:20}}>
          <div style={{background:'var(--bg-2)',padding:12,borderRadius:8,border:'1px solid var(--border-light)'}}>
            <div style={{fontSize:'11px',fontWeight:600,color:'var(--text-4)'}}>{t(selectedLanguage, 'totalDetections')}</div>
            <div style={{fontSize:'20px',fontWeight:800,color:'var(--text-1)',marginTop:4}}>{stats?.total_detections ?? 0}</div>
          </div>
          <div style={{background:'var(--bg-2)',padding:12,borderRadius:8,border:'1px solid var(--border-light)'}}>
            <div style={{fontSize:'11px',fontWeight:600,color:'var(--text-4)'}}>{t(selectedLanguage, 'criticalAlerts')}</div>
            <div style={{fontSize:'20px',fontWeight:800,color:'#E74C3C',marginTop:4}}>{stats?.critical_alerts ?? 0}</div>
          </div>
          <div style={{background:'var(--bg-2)',padding:12,borderRadius:8,border:'1px solid var(--border-light)'}}>
            <div style={{fontSize:'11px',fontWeight:600,color:'var(--text-4)'}}>{t(selectedLanguage, 'liveModel')}</div>
            <div style={{fontSize:'14px',fontWeight:700,color:'var(--accent)',marginTop:6}}>
              {modelStatus?.status === 'ready' ? '3 PlantDoc Models' : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Inspection History Log */}
        <div>
          <div style={{fontSize:'14px',fontWeight:700,color:'var(--text-2)',marginBottom:10}}>
            {t(selectedLanguage, 'diseaseHistory')} ({alerts?.length || 0})
          </div>

          {!alerts || alerts.length === 0 ? (
            <div style={{textAlign:'center',padding:'30px 10px',color:'var(--text-4)',fontSize:'13px'}}>
              {t(selectedLanguage, 'noReportsYet')}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {alerts.map((a, idx) => (
                <div
                  key={a.id || idx}
                  style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'var(--bg-2)',borderRadius:8,border:'1px solid var(--border-light)'}}
                >
                  <div>
                    <div style={{fontSize:'14px',fontWeight:600,color:'var(--text-1)'}}>
                      {translateDiseaseName(a.disease, selectedLanguage)}
                    </div>
                    <div style={{fontSize:'12px',color:'var(--text-4)',marginTop:2}}>
                      {a.timestamp ? new Date(a.timestamp).toLocaleString() : 'Recent'} · {a.model_agreement || '3/3 agree'}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span style={{fontWeight:700,color:'var(--accent)',fontSize:'14px'}}>
                      {Math.round((a.confidence || 0) * 100)}%
                    </span>
                    <div style={{fontSize:'11px',fontWeight:600,color: (a.severity||'').toLowerCase().includes('high') ? '#E74C3C' : 'var(--amber)'}}>
                      {a.severity || 'Moderate'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',marginTop:20}}>
          <button className="ps-btn ps-btn-primary" onClick={onClose}>
            {t(selectedLanguage, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
}
