import React from 'react';

export function AlertsPanel({ alerts, onClearAlerts }) {
  return (
    <div className="alerts-card">
      <div className="alerts-header">
        <div className="alerts-title">
          <span>🚨</span> Disease Alerts
        </div>
        {alerts.length > 0 && (
          <button
            onClick={onClearAlerts}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="all-clear-box">
            <div className="all-clear-icon">🛡️</div>
            <div className="all-clear-title">All Clear</div>
            <div className="all-clear-desc">No disease detected in active stream.</div>
          </div>
        ) : (
          alerts.map((alert, idx) => {
            const sev = alert.severity?.toLowerCase() || 'low';
            const sevClass = `alert-item-${sev}`;
            const tagClass = `tag-${sev}`;
            
            const timeStr = alert.timestamp
              ? new Date(alert.timestamp).toLocaleTimeString()
              : new Date().toLocaleTimeString();

            return (
              <div key={alert.id || idx} className={`alert-item ${sevClass}`}>
                <div className="alert-top">
                  <span className="alert-name">{alert.disease}</span>
                  <span className="alert-time">{timeStr}</span>
                </div>

                <div className="alert-meta">
                  <span className={`severity-tag ${tagClass}`}>{alert.severity || 'Low'}</span>
                  <span>Conf: {(alert.confidence * 100).toFixed(1)}%</span>
                  {alert.affected_area_percent > 0 && (
                    <span>· Area: {alert.affected_area_percent}%</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
