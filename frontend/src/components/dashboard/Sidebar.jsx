import React, { useRef } from 'react';
import { t, translateDiseaseName } from '../../i18n';

export function Sidebar({
  isOpen, activeTab, setActiveTab, selectedLanguage,
  cameraDevices, selectedCamera, setSelectedCamera,
  isCameraRunning, onStartCamera, onStopCamera, onScanCameras,
  onUploadVideo, onUploadImage, cameraCountMessage, cameraError,
  alerts, onClearHistory, onClose,
}) {
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  return (
    <>
      {/* Overlay for mobile */}
      <div className={`ps-mobile-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />

      <aside className={`ps-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Mode tabs */}
        <div className="ps-mode-tabs">
          {[
            { id: 'camera', icon: '📷', label: t(selectedLanguage, 'camera') },
            { id: 'video',  icon: '🎬', label: t(selectedLanguage, 'video') },
            { id: 'image',  icon: '📸', label: t(selectedLanguage, 'image') },
          ].map(m => (
            <button
              key={m.id}
              className={`ps-mode-tab ${activeTab === m.id ? 'active' : ''}`}
              onClick={() => setActiveTab(m.id)}
            >
              <span className="tab-icon">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="ps-sidebar-controls">
          {activeTab === 'camera' && (
            <>
              <select
                className="ps-cam-select"
                value={selectedCamera}
                onChange={e => setSelectedCamera(e.target.value)}
                disabled={isCameraRunning}
              >
                {cameraDevices.length === 0
                  ? <option value="">{t(selectedLanguage, 'noCamerasFound')}</option>
                  : cameraDevices.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId}>
                      {d.label || `${t(selectedLanguage, 'camera')} ${i + 1}`}
                    </option>
                  ))
                }
              </select>
              <div className="ps-cam-actions">
                <button className="ps-btn ps-btn-ghost" style={{padding:'7px 10px'}} onClick={onScanCameras}>🔍 {t(selectedLanguage, 'scan')}</button>
                {!isCameraRunning
                  ? <button className="ps-btn ps-btn-primary" onClick={onStartCamera}>▶ {t(selectedLanguage, 'start')}</button>
                  : <button className="ps-btn ps-btn-danger"  onClick={onStopCamera}>⏹ {t(selectedLanguage, 'stop')}</button>
                }
              </div>
              {(cameraCountMessage || cameraError) && (
                <div className={`ps-cam-msg ${cameraError ? 'error' : ''}`}>
                  {cameraError ? '✕ ' : '✓ '}{cameraError || cameraCountMessage}
                </div>
              )}
            </>
          )}

          {activeTab === 'video' && (
            <>
              <button className="ps-btn ps-btn-upload" onClick={() => videoInputRef.current?.click()}>
                📁 {t(selectedLanguage, 'chooseVideoFile')}
              </button>
              <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/*" style={{display:'none'}}
                onChange={e => { if(e.target.files?.[0]) onUploadVideo(e.target.files[0]); }} />
            </>
          )}

          {activeTab === 'image' && (
            <>
              <button className="ps-btn ps-btn-upload" onClick={() => imageInputRef.current?.click()}>
                🖼 {t(selectedLanguage, 'chooseImageFile')}
              </button>
              <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/*" style={{display:'none'}}
                onChange={e => { if(e.target.files?.[0]) onUploadImage(e.target.files[0]); }} />
            </>
          )}
        </div>

        {/* Detection History */}
        <div className="ps-history">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div className="ps-history-title" style={{margin:0}}>{t(selectedLanguage, 'diseaseHistory')}</div>
            {alerts && alerts.length > 0 && onClearHistory && (
              <button
                onClick={onClearHistory}
                style={{background:'none',border:'none',color:'var(--text-4)',fontSize:'11px',cursor:'pointer'}}
              >
                {t(selectedLanguage, 'clearHistory')}
              </button>
            )}
          </div>

          {!alerts || alerts.length === 0 ? (
            <div className="ps-history-empty">
              <span className="empty-icon">🌱</span>
              {t(selectedLanguage, 'noDetectionsYet')}<br />{t(selectedLanguage, 'startCameraMedia')}
            </div>
          ) : (
            alerts.map((a, i) => {
              const sev = (a.severity || '').toLowerCase();
              const sevCls = sev.includes('high') || sev.includes('severe') ? 'high'
                : sev.includes('mod') ? 'moderate' : 'healthy';
              const translatedTitle = translateDiseaseName(a.disease, selectedLanguage);
              return (
                <div key={a.id || i} className="ps-history-item">
                  <span className={`ps-history-sev ${sevCls}`} />
                  <div className="ps-history-text">
                    <div className="ps-history-name">{translatedTitle}</div>
                    <div className="ps-history-time">
                      {Math.round((a.confidence || 0) * 100)}% · {a.severity || 'Unknown'}
                      {a.model_agreement ? ` · ${a.model_agreement}` : ''}
                      {a.timestamp ? ` · ${new Date(a.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}` : ''}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
