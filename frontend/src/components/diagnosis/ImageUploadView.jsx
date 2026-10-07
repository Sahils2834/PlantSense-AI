import React, { useState, useRef } from 'react';
import { t } from '../../i18n';

export function ImageUploadView({ onImageDiagnose, isAnalyzing, selectedLanguage, onClearImage }) {
  const [preview, setPreview] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onImageDiagnose(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onClearImage) onClearImage();
  };

  return (
    <div className="ps-upload-view">
      {!preview ? (
        <div
          className={`ps-drop-zone ${drag ? 'over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/*"
            onChange={e => handleFile(e.target.files?.[0])}
          />
          <div className="ps-drop-icon">📸</div>
          <div className="ps-drop-title">{t(selectedLanguage, 'dropLeafImage')}</div>
          <div className="ps-drop-sub">{t(selectedLanguage, 'imageFormats')}</div>
          <div className="ps-drop-btn">{t(selectedLanguage, 'browseFiles')}</div>
        </div>
      ) : (
        <div className="ps-image-preview">
          <img src={preview} alt="Selected plant leaf" />
          <div className="ps-image-actions">
            {isAnalyzing
              ? <span style={{display:'flex',alignItems:'center',gap:8,color:'var(--accent)',fontSize:'13px',fontWeight:600}}>
                  <span className="ps-spinner" /> {t(selectedLanguage, 'analyzing')}
                </span>
              : <button className="ps-btn ps-btn-ghost" onClick={handleReset}>↩ {t(selectedLanguage, 'chooseAnother')}</button>
            }
          </div>
        </div>
      )}
    </div>
  );
}
