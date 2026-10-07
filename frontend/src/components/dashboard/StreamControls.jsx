import React, { useRef } from 'react';
import { UI_TRANSLATIONS } from '../../utils/languages';

export function StreamControls({
  activeTab,
  setActiveTab,
  cameraDevices,
  selectedCamera,
  setSelectedCamera,
  onScanCameras,
  isCameraRunning,
  onStartCamera,
  onStopCamera,
  onUploadVideo,
  onRefresh,
  cameraCountMessage,
  cameraError,
  selectedLanguage
}) {
  const videoInputRef = useRef(null);
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadVideo(file);
    }
  };

  return (
    <div className="stream-controls-bar">
      <div className="mode-selector-tabs">
        <button
          className={`mode-tab ${activeTab === 'camera' ? 'mode-active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          <span>📹</span> Live Camera Feed
        </button>
        <button
          className={`mode-tab ${activeTab === 'video' ? 'mode-active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          <span>🎬</span> Video Upload & Analysis
        </button>
        <button
          className={`mode-tab ${activeTab === 'image' ? 'mode-active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          <span>📸</span> Leaf Photo Upload
        </button>
      </div>

      <div className="controls-group">
        {activeTab === 'camera' && (
          <>
            <select
              className="select-dropdown"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              disabled={isCameraRunning}
            >
              {cameraDevices.length === 0 ? (
                <option value="">No camera detected (Click Scan)</option>
              ) : (
                cameraDevices.map((dev, idx) => (
                  <option key={dev.deviceId || idx} value={dev.deviceId}>
                    {dev.label || `Camera ${idx + 1}`}
                  </option>
                ))
              )}
            </select>

            <button className="btn-ctrl btn-secondary" onClick={onScanCameras}>
              <span>📷</span> Scan Cameras
            </button>

            {!isCameraRunning ? (
              <button className="btn-ctrl btn-primary" onClick={onStartCamera}>
                <span>▶</span> Start Camera Feed
              </button>
            ) : (
              <button className="btn-ctrl btn-stop" onClick={onStopCamera}>
                <span>⏹</span> Stop Camera Feed
              </button>
            )}
          </>
        )}

        {activeTab === 'video' && (
          <button
            className="btn-ctrl btn-upload"
            onClick={() => videoInputRef.current?.click()}
          >
            <span>📁</span> Choose Video File
          </button>
        )}

        {/* Hidden video input */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/*"
          onChange={handleVideoFileChange}
          style={{ display: 'none' }}
        />

        <button className="btn-ctrl btn-secondary" onClick={onRefresh} title="Refresh Dashboard">
          <span>🔄</span> Refresh
        </button>
      </div>

      {(cameraCountMessage || cameraError) && activeTab === 'camera' && (
        <div style={{ fontSize: '12px', color: cameraError ? '#ef4444' : '#10b981', fontWeight: '600', width: '100%' }}>
          {cameraError || cameraCountMessage}
        </div>
      )}
    </div>
  );
}
