import React from 'react';

export function ModelStatusCard({ modelStatus }) {
  const models = modelStatus?.models || [
    { name: "YOLO11n", loaded: true, weight: 0.35 },
    { name: "YOLO12n", loaded: true, weight: 0.35 },
    { name: "YOLO26n", loaded: true, weight: 0.30 }
  ];

  return (
    <div className="alerts-card" style={{ marginTop: '1rem' }}>
      <div className="alerts-header">
        <div className="alerts-title">
          <span>⚙️</span> Model Registry & Hybrid Status
        </div>
        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
          {modelStatus?.status === 'ready' ? 'HYBRID ACTIVE' : 'INITIALIZING'}
        </span>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {models.map((m, idx) => (
          <div
            key={idx}
            style={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px'
            }}
          >
            <div>
              <strong style={{ color: '#ffffff' }}>{m.name}</strong>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Weight: {m.weight ? (m.weight * 100).toFixed(0) + '%' : '33%'}
              </div>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                background: m.loaded ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: m.loaded ? '#10b981' : '#ef4444'
              }}
            >
              {m.loaded ? 'LOADED' : 'UNAVAILABLE'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
