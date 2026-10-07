import React, { useState } from 'react';
import { t } from '../../i18n';

export function FarmerContextDrawer({ farmerContext, onContextChange, selectedLanguage }) {
  const [open, setOpen] = useState(false);

  const set = (k, v) => onContextChange(prev => ({ ...prev, [k]: v }));

  return (
    <div className="ps-context-drawer">
      <button className="ps-context-toggle" onClick={() => setOpen(o => !o)}>
        <span className="ps-context-toggle-left">
          <span>🌾</span>
          <span>{t(selectedLanguage, 'farmerContext')}</span>
          {farmerContext.crop && (
            <span style={{marginLeft:6,fontSize:'11px',color:'var(--accent)',fontWeight:500}}>
              · {farmerContext.crop}{farmerContext.location ? `, ${farmerContext.location}` : ''}
            </span>
          )}
        </span>
        <span className={`ps-chevron ${open ? 'open' : ''}`}>▼</span>
      </button>

      <div className={`ps-context-body ${open ? 'open' : ''}`}>
        {[
          { key:'crop',        label: t(selectedLanguage, 'cropType'),     placeholder:'e.g. Tomato, Corn, Apple' },
          { key:'location',    label: t(selectedLanguage, 'location'),      placeholder:'e.g. Maharashtra, Punjab' },
          { key:'growthStage', label: t(selectedLanguage, 'growthStage'),  placeholder:'e.g. Flowering, Fruiting' },
          { key:'weather',     label: t(selectedLanguage, 'weather'),      placeholder:'e.g. Humid, 28°C' },
          { key:'irrigation',  label: t(selectedLanguage, 'irrigation'),   placeholder:'e.g. Drip, Sprinkler' },
        ].map(f => (
          <div className="ps-ctx-field" key={f.key}>
            <label>{f.label}</label>
            <input
              type="text"
              value={farmerContext[f.key] || ''}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
