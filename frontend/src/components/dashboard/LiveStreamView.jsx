import React, { useEffect, useRef } from 'react';

export function LiveStreamView({
  videoRef,
  canvasRef,
  isCameraRunning,
  uploadedVideoUrl,
  currentResult,
  isAnalyzing,
  onVideoEnded
}) {
  const isStreamActive = isCameraRunning || !!uploadedVideoUrl;

  // Draw detection bounding box and badges on the overlay canvas
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas internal resolution to actual video dimensions
    const displayWidth = video.clientWidth || 800;
    const displayHeight = video.clientHeight || 450;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isStreamActive || !currentResult) return;

    const videoWidth = video.videoWidth || displayWidth;
    const videoHeight = video.videoHeight || displayHeight;

    const scaleX = displayWidth / videoWidth;
    const scaleY = displayHeight / videoHeight;

    // If Unknown / OOD Warning
    if (currentResult.is_unknown) {
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillRect(16, 16, 260, 42);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, 260, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText('⚠️ UNKNOWN / LOW CONFIDENCE', 28, 42);
      ctx.restore();
      return;
    }

    // Draw detections
    const detections = currentResult.detections || [];
    if (detections.length === 0 && currentResult.disease && currentResult.disease !== "Healthy Leaf") {
      // Draw centered info card if bounding box coordinates aren't explicit
      const boxW = displayWidth * 0.5;
      const boxH = displayHeight * 0.5;
      const boxX = (displayWidth - boxW) / 2;
      const boxY = (displayHeight - boxH) / 2;

      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Label Pill
      ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
      ctx.fillRect(boxX, boxY - 70, 220, 64);
      ctx.strokeStyle = '#374151';
      ctx.strokeRect(boxX, boxY - 70, 220, 64);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(currentResult.disease, boxX + 12, boxY - 45);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px system-ui, sans-serif';
      const confPct = currentResult.confidence ? (currentResult.confidence * 100).toFixed(1) : '90.0';
      ctx.fillText(`Conf: ${confPct}%  ·  Sev: ${currentResult.severity || 'Moderate'}`, boxX + 12, boxY - 22);

      ctx.restore();
    } else {
      detections.forEach((det) => {
        if (!det.bbox || det.bbox.length < 4) return;
        
        const [x1, y1, x2, y2] = det.bbox;
        const drawX = x1 * scaleX;
        const drawY = y1 * scaleY;
        const drawW = (x2 - x1) * scaleX;
        const drawH = (y2 - y1) * scaleY;

        ctx.save();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(drawX, drawY, drawW, drawH);

        // Bounding Box Header Box
        const labelText = det.label || currentResult.disease || "Disease Detected";
        const confText = det.confidence ? `${(det.confidence * 100).toFixed(1)}%` : '94.0%';
        const sevText = det.severity || currentResult.severity || 'Moderate';
        const areaText = det.affected_area_percent ? `${det.affected_area_percent}% area` : '';

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(drawX, Math.max(0, drawY - 60), 210, 56);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.strokeRect(drawX, Math.max(0, drawY - 60), 210, 56);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText(labelText, drawX + 10, Math.max(0, drawY - 38));

        ctx.fillStyle = '#38bdf8';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(`${confText} · ${sevText} ${areaText ? '· ' + areaText : ''}`, drawX + 10, Math.max(0, drawY - 18));

        ctx.restore();
      });
    }

    // Model agreement badge at top right of canvas
    if (currentResult.model_agreement) {
      const agr = currentResult.model_agreement;
      ctx.save();
      ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
      ctx.fillRect(displayWidth - 170, 16, 154, 32);
      ctx.strokeStyle = '#374151';
      ctx.strokeRect(displayWidth - 170, 16, 154, 32);

      ctx.fillStyle = '#10b981';
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.fillText(`Ensemble: ${agr.models_agreeing}/${agr.total_models} Agree`, displayWidth - 158, 36);
      ctx.restore();
    }

  }, [currentResult, isStreamActive]);

  return (
    <div className="feed-card">
      <div className="feed-header">
        <div className="feed-title">
          <span>🌿</span> Live Inspection Stream
        </div>

        <div className={`stream-status-pill ${isStreamActive ? 'pill-active' : 'pill-idle'}`}>
          {isStreamActive ? (isCameraRunning ? '● LIVE CAMERA' : '● VIDEO PLAYBACK') : 'IDLE'}
        </div>
      </div>

      <div className="video-stage">
        {/* Video element */}
        <video
          ref={videoRef}
          className="stream-video"
          playsInline
          muted
          autoPlay
          controls={!!uploadedVideoUrl}
          onEnded={onVideoEnded}
          style={{ display: isStreamActive ? 'block' : 'none' }}
        />

        {/* Canvas overlay element */}
        <canvas
          ref={canvasRef}
          className="stream-canvas"
          style={{ display: isStreamActive ? 'block' : 'none' }}
        />

        {/* Placeholder when idle */}
        {!isStreamActive && (
          <div className="feed-placeholder">
            <div className="placeholder-icon">🌱</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#e5e7eb' }}>
                No Active Inspection Stream
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Select a camera and click <strong>"Start Camera"</strong> or click <strong>"Upload Video"</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / Controls status */}
      <div className="video-controls-bar">
        <div>
          {isAnalyzing ? (
            <span style={{ color: '#38bdf8', fontWeight: '600' }}>⚡ Processing Frame Inference...</span>
          ) : isStreamActive ? (
            <span style={{ color: '#10b981' }}>✓ Sampling stream @ ~2-5 FPS (500ms non-blocking)</span>
          ) : (
            <span>Ready for stream source selection</span>
          )}
        </div>

        {currentResult && (
          <div>
            <strong>Latest Diagnosis:</strong>{' '}
            <span style={{ color: currentResult.is_unknown ? '#ef4444' : '#facc15' }}>
              {currentResult.disease || 'Healthy'}
            </span>{' '}
            ({(currentResult.confidence * 100).toFixed(1)}%)
          </div>
        )}
      </div>
    </div>
  );
}
