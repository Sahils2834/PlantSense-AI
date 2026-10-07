import React, { useState } from 'react';
import { UI_TRANSLATIONS } from '../../utils/languages';

export function FarmerContextForm({ farmerContext, onContextChange, selectedLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  const handleChange = (field, value) => {
    onContextChange({
      ...farmerContext,
      [field]: value
    });
  };

  return (
    <div className="farmer-context-card">
      <button className="context-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="btn-icon">👨‍🌾</span>
        <span>{t.farmerContext || 'Optional Farmer Context'}</span>
        <span className="badge-optional">(Personalize Advice)</span>
        <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="context-form-grid">
          <div className="form-group">
            <label className="form-label">{t.crop || 'Crop'}:</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tomato, Potato, Corn"
              value={farmerContext.crop || ''}
              onChange={(e) => handleChange('crop', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.location || 'Location / State'}:</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maharashtra, Punjab"
              value={farmerContext.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.growthStage || 'Growth Stage'}:</label>
            <select
              className="form-select"
              value={farmerContext.growthStage || ''}
              onChange={(e) => handleChange('growthStage', e.target.value)}
            >
              <option value="">Select Stage</option>
              <option value="Seedling">Seedling / Germination</option>
              <option value="Vegetative">Vegetative Growth</option>
              <option value="Flowering">Flowering Stage</option>
              <option value="Fruiting">Fruiting / Podding</option>
              <option value="Harvesting">Pre-Harvest</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t.weather || 'Weather'}:</label>
            <select
              className="form-select"
              value={farmerContext.weather || ''}
              onChange={(e) => handleChange('weather', e.target.value)}
            >
              <option value="">Select Condition</option>
              <option value="High Humidity">High Humidity / Wet</option>
              <option value="Rainy">Rainy / Overcast</option>
              <option value="Hot & Dry">Hot & Dry</option>
              <option value="Cool & Foggy">Cool & Foggy</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t.irrigation || 'Irrigation'}:</label>
            <select
              className="form-select"
              value={farmerContext.irrigation || ''}
              onChange={(e) => handleChange('irrigation', e.target.value)}
            >
              <option value="">Select Irrigation</option>
              <option value="Drip Irrigation">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Flood / Furrow">Flood / Furrow</option>
              <option value="Rainfed">Rainfed</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
