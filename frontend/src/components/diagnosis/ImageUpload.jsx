import React, { useState, useRef } from 'react';
import { UI_TRANSLATIONS } from '../../utils/languages';

export function ImageUpload({ onImageDiagnose, isAnalyzing, selectedLanguage }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Automatically trigger diagnosis
    onImageDiagnose(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="image-upload-card">
      <div className="upload-header">
        <span>📸 {t.uploadImage || 'Upload Leaf Image'}</span>
      </div>

      {!previewUrl ? (
        <div
          className={`drop-zone ${dragOver ? 'drag-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-icon">🍃</div>
          <div className="drop-title">Drag & Drop Plant Leaf Photo</div>
          <div className="drop-subtitle">or click to browse JPG, PNG, WEBP files</div>
          <button type="button" className="btn-browse">Select Photo</button>
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={previewUrl} alt="Leaf Preview" className="uploaded-image-preview" />
          <div className="image-preview-overlay">
            <button className="btn-reselect" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
              🔄 Change Photo
            </button>
            <button className="btn-clear-image" onClick={handleClear} disabled={isAnalyzing}>
              ❌ Clear
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
}
