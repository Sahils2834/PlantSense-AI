import React from 'react';
import { t, translateDiseaseName } from '../../i18n';

export function VideoAnalysisResult({ videoResult, isProcessingVideo, videoProgress, selectedLanguage }) {
  if (isProcessingVideo) {
    const progressPct = videoProgress?.totalFrames > 0
      ? Math.min(100, Math.round((videoProgress.currentFrame / videoProgress.totalFrames) * 100))
      : 50;

    return (
      <div className="ps-video-progress-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <span style={{fontSize:'13px',fontWeight:600,color:'var(--text-1)'}}>
            🔄 {t(selectedLanguage, 'uploadingAndAnalyzing')}
          </span>
          <span style={{fontSize:'12px',fontWeight:700,color:'var(--accent)'}}>{progressPct}%</span>
        </div>

        <div className="ps-progress-bar-bg">
          <div className="ps-progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'var(--text-3)',marginTop:8}}>
          <div>
            Frame: <strong>{videoProgress?.currentFrame || 0} / {videoProgress?.totalFrames || '...'}</strong>
          </div>
          <div style={{color:'var(--accent)',fontWeight:600}}>
            {t(selectedLanguage, 'samplingFps')}
          </div>
        </div>
      </div>
    );
  }

  if (!videoResult) return null;

  const isNonPlant = videoResult.is_plant === false || videoResult.primary_disease?.toLowerCase().includes('no supported plant');
  const translatedPrimary = translateDiseaseName(videoResult.primary_disease, selectedLanguage);

  return (
    <div className="ps-result-card" style={{marginTop:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,borderBottom:'1px solid var(--border-light)',paddingBottom:8}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:'14px',fontWeight:700,color:'var(--text-1)'}}>
          <span>🎬</span>
          <span>{t(selectedLanguage, 'videoReportTitle')}</span>
        </div>
        <span className="ps-meta-chip" style={{background:'var(--accent-dim)',color:'var(--accent)',fontWeight:600}}>
          {t(selectedLanguage, 'aggregatedDetection')}
        </span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))',gap:10,marginBottom:14}}>
        <div style={{background:'var(--bg-2)',padding:'10px',borderRadius:6,border:'1px solid var(--border-light)'}}>
          <div style={{fontSize:'11px',color:'var(--text-4)',fontWeight:600,textTransform:'uppercase'}}>{t(selectedLanguage, 'plantSpecies')}</div>
          <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-1)',marginTop:4}}>🌿 {videoResult.plant || 'Crop'}</div>
        </div>

        <div style={{background:'var(--bg-2)',padding:'10px',borderRadius:6,border:'1px solid var(--border-light)'}}>
          <div style={{fontSize:'11px',color:'var(--text-4)',fontWeight:600,textTransform:'uppercase'}}>{t(selectedLanguage, 'primaryDisease')}</div>
          <div style={{fontSize:'13px',fontWeight:700,color: isNonPlant ? '#E74C3C' : 'var(--text-1)',marginTop:4}}>
            {translatedPrimary}
          </div>
        </div>

        <div style={{background:'var(--bg-2)',padding:'10px',borderRadius:6,border:'1px solid var(--border-light)'}}>
          <div style={{fontSize:'11px',color:'var(--text-4)',fontWeight:600,textTransform:'uppercase'}}>{t(selectedLanguage, 'maxConfidence')}</div>
          <div style={{fontSize:'13px',fontWeight:700,color:'var(--accent)',marginTop:4}}>
            {Math.round((videoResult.max_confidence || 0) * 100)}%
          </div>
        </div>

        <div style={{background:'var(--bg-2)',padding:'10px',borderRadius:6,border:'1px solid var(--border-light)'}}>
          <div style={{fontSize:'11px',color:'var(--text-4)',fontWeight:600,textTransform:'uppercase'}}>{t(selectedLanguage, 'avgConfidence')}</div>
          <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-1)',marginTop:4}}>
            {Math.round((videoResult.avg_confidence || 0) * 100)}%
          </div>
        </div>

        <div style={{background:'var(--bg-2)',padding:'10px',borderRadius:6,border:'1px solid var(--border-light)'}}>
          <div style={{fontSize:'11px',color:'var(--text-4)',fontWeight:600,textTransform:'uppercase'}}>{t(selectedLanguage, 'analyzedFrames')}</div>
          <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-1)',marginTop:4}}>
            {videoResult.analyzedFrames || videoResult.analyzed_frames || 0} / {videoResult.total_frames || 0}
          </div>
        </div>

        <div style={{background:'var(--bg-2)',padding:'10px',borderRadius:6,border:'1px solid var(--border-light)'}}>
          <div style={{fontSize:'11px',color:'var(--text-4)',fontWeight:600,textTransform:'uppercase'}}>{t(selectedLanguage, 'affectedFrames')}</div>
          <div style={{fontSize:'13px',fontWeight:700,color:'var(--amber)',marginTop:4}}>
            {videoResult.affected_frames || 0} ({videoResult.affected_percent || 0}%)
          </div>
        </div>
      </div>

      {videoResult.detected_diseases && videoResult.detected_diseases.length > 0 && (
        <div style={{marginTop:10}}>
          <div style={{fontSize:'12px',fontWeight:700,color:'var(--text-2)',marginBottom:8}}>
            📊 {t(selectedLanguage, 'detectedDiseasesBreakdown')}:
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {videoResult.detected_diseases.map((d, idx) => (
              <div key={idx} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'var(--bg-2)',borderRadius:6,border:'1px solid var(--border-light)'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:'11px',fontWeight:700,color:'var(--accent)'}}>#{idx + 1}</span>
                  <span style={{fontSize:'13px',fontWeight:600,color:'var(--text-1)'}}>
                    {translateDiseaseName(d.disease, selectedLanguage)}
                  </span>
                </div>
                <div style={{fontSize:'12px',color:'var(--text-3)'}}>
                  <strong>{Math.round((d.confidence || 0) * 100)}%</strong> · {d.frame_count} frames
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
