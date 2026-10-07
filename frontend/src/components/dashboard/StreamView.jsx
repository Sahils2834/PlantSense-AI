import React, { useEffect, useRef } from 'react';
import { t, translateDiseaseName } from '../../i18n';

export function StreamView({
  videoRef,
  canvasRef,
  isCameraRunning,
  uploadedVideoUrl,
  currentResult,
  isAnalyzing,
  onVideoEnded,
  selectedLanguage
}) {
  const isActive = isCameraRunning || !!uploadedVideoUrl;

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video || !isActive || !currentResult) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = video.clientWidth || 800;
    const h = video.clientHeight || 450;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    if (currentResult.is_unknown || currentResult.is_plant === false) {
      ctx.save();
      ctx.fillStyle = 'rgba(192,57,43,0.85)';
      ctx.fillRect(16, 16, 280, 40);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Inter,sans-serif';
      ctx.fillText(currentResult.is_plant === false ? '⚠ NO PLANT DETECTED' : '⚠ LOW CONFIDENCE', 28, 40);
      ctx.restore();
      return;
    }

    const detections = currentResult.detections || [];
    const scaleX = w / (video.videoWidth || w);
    const scaleY = h / (video.videoHeight || h);

    if (detections.length === 0 && currentResult.disease && !currentResult.disease.toLowerCase().includes('healthy')) {
      const bw = w * 0.5, bh = h * 0.5;
      const bx = (w - bw) / 2, by = (h - bh) / 2;
      ctx.save();
      ctx.strokeStyle = '#52B788'; ctx.lineWidth = 2;
      ctx.setLineDash([6,4]); ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]);
      ctx.restore();
    } else {
      detections.forEach(det => {
        if (!det.bbox || det.bbox.length < 4) return;
        const [x1, y1, x2, y2] = det.bbox;
        const dx = x1*scaleX, dy = y1*scaleY, dw = (x2-x1)*scaleX, dh = (y2-y1)*scaleY;
        ctx.save();
        ctx.strokeStyle = '#40916C'; ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, dw, dh);
        ctx.fillStyle = 'rgba(45,106,79,0.85)';
        ctx.fillRect(dx, Math.max(0, dy-28), 160, 26);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Inter,sans-serif';
        ctx.fillText(det.label || currentResult.disease || 'Disease', dx+8, Math.max(0, dy-10));
        ctx.restore();
      });
    }
  }, [currentResult, isActive, selectedLanguage]);

  const sevClass = () => {
    if (!currentResult) return '';
    const s = currentResult.severity?.toLowerCase() || '';
    if (s.includes('high') || s.includes('severe')) return 'danger';
    if (s.includes('mod')) return 'warn';
    return '';
  };

  const confPct = currentResult ? Math.round((currentResult.confidence || 0) * 100) : 0;
  const isHealthy = currentResult?.disease?.toLowerCase().includes('healthy');
  const isNonPlant = currentResult?.is_plant === false || currentResult?.disease?.toLowerCase().includes('no supported plant');
  const translatedTitle = currentResult ? translateDiseaseName(currentResult.disease, selectedLanguage) : '';

  return (
    <div className="ps-stream-wrap">
      {/* Toolbar overlay */}
      <div className="ps-stream-toolbar">
        <div className={`ps-stream-chip ${!isActive ? 'idle' : isAnalyzing ? 'analyzing' : 'live'}`}>
          <span className="ps-chip-dot" />
          {!isActive ? 'IDLE' : isAnalyzing ? t(selectedLanguage, 'analyzing').toUpperCase() : isCameraRunning ? t(selectedLanguage, 'liveModel') : 'VIDEO'}
        </div>
      </div>

      <video
        ref={videoRef}
        className="ps-stream-video"
        playsInline muted autoPlay
        controls={!!uploadedVideoUrl}
        onEnded={onVideoEnded}
        style={{ display: isActive ? 'block' : 'none' }}
      />
      <canvas ref={canvasRef} className="ps-stream-canvas" style={{ display: isActive ? 'block' : 'none' }} />

      {!isActive && (
        <div className="ps-stream-placeholder">
          <div className="ps-placeholder-icon">🌿</div>
          <div className="ps-placeholder-title">{t(selectedLanguage, 'noDetectionsYet')}</div>
          <div className="ps-placeholder-sub">{t(selectedLanguage, 'startCameraMedia')}</div>
          <div className="ps-placeholder-hint">
            <span className="ps-placeholder-chip">📷 {t(selectedLanguage, 'camera')}</span>
            <span className="ps-placeholder-chip">🎬 {t(selectedLanguage, 'video')}</span>
            <span className="ps-placeholder-chip">📸 {t(selectedLanguage, 'image')}</span>
          </div>
        </div>
      )}

      {isActive && currentResult && (
        <div className="ps-detection-overlay">
          <div className="ps-detection-name" style={{color: isNonPlant ? '#E74C3C' : '#fff'}}>
            {isHealthy ? '✓ ' : ''}{translatedTitle || t(selectedLanguage, 'analyzing')}
          </div>
          {!isNonPlant && (
            <div className="ps-detection-conf-row">
              <div className="ps-conf-bar">
                <div className={`ps-conf-fill ${sevClass()}`} style={{ width: `${confPct}%` }} />
              </div>
              <span className="ps-detection-conf-pct">{confPct}%</span>
            </div>
          )}
          {currentResult.severity && !isNonPlant && (
            <div className="ps-detection-tags">
              <span className={`ps-detection-tag ${isHealthy ? 'healthy' : confPct > 80 ? 'high' : 'moderate'}`}>
                {currentResult.severity}
              </span>
              {currentResult.model_agreement && (
                <span className="ps-detection-tag moderate">
                  {currentResult.model_agreement.agreement_str || `${currentResult.model_agreement.models_agreeing}/${currentResult.model_agreement.total_models}`} {t(selectedLanguage, 'modelsAgree')}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
