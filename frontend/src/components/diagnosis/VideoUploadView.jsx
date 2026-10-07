import React, { useState, useRef } from 'react';
import { t } from '../../i18n';
import { VideoAnalysisResult } from './VideoAnalysisResult';

export function VideoUploadView({ onUploadVideo, isAnalyzing, selectedLanguage, onClearVideo }) {
  const [drag, setDrag] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoResult, setVideoResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setIsProcessing(true);
    setProgress(15);

    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p < 40) return p + 10;
        if (p < 85) return p + 5;
        return p;
      });
    }, 800);

    try {
      const result = await onUploadVideo(file);
      if (result) setVideoResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(progressTimer);
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setVideoResult(null);
    setProgress(0);
    setIsProcessing(false);
    if (inputRef.current) inputRef.current.value = '';
    if (onClearVideo) onClearVideo();
  };

  return (
    <div className="ps-video-view">
      {!videoUrl ? (
        <div
          className={`ps-video-drop ${drag ? 'over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if(f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/*"
            onChange={e => handleFile(e.target.files?.[0])} />
          <div style={{fontSize:'28px'}}>🎬</div>
          <div style={{fontSize:'13px',fontWeight:600,color:'var(--text-2)'}}>{t(selectedLanguage, 'dropVideoFile')}</div>
          <div style={{fontSize:'11px',color:'var(--text-4)'}}>{t(selectedLanguage, 'videoFormats')}</div>
        </div>
      ) : (
        <div>
          <div style={{position:'relative',borderRadius:8,overflow:'hidden',background:'#000',maxHeight:340}}>
            <video
              src={videoUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              style={{width:'100%',height:'auto',maxHeight:340,display:'block'}}
            />
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
            <button className="ps-btn ps-btn-ghost" onClick={handleReset}>
              ↩ {t(selectedLanguage, 'chooseAnother')}
            </button>
          </div>

          <VideoAnalysisResult
            videoResult={videoResult}
            isProcessingVideo={isProcessing}
            videoProgress={{ currentFrame: Math.round(progress * 1.5), totalFrames: 150 }}
            selectedLanguage={selectedLanguage}
          />
        </div>
      )}
    </div>
  );
}
