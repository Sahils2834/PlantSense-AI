import React from 'react';

export function StatsCards({ stats, isStreamActive }) {
  const criticalCount = stats?.critical_alerts ?? 0;
  const totalDetections = stats?.total_detections ?? 0;
  const activeStreamsCount = isStreamActive ? 1 : 0;

  return (
    <div className="stats-grid">
      {/* CARD 1: AI Model Ready */}
      <div className="stat-card">
        <div className="stat-icon-wrap stat-icon-green">⚡</div>
        <div className="stat-info">
          <span className="stat-label">AI Model Status</span>
          <span className="stat-value">AI Model Ready</span>
          <span className="stat-subtext">Hybrid Ensemble (YOLO11/12/26)</span>
        </div>
      </div>

      {/* CARD 2: Critical Disease Alerts */}
      <div className="stat-card">
        <div className="stat-icon-wrap stat-icon-red">⚠️</div>
        <div className="stat-info">
          <span className="stat-label">Critical Disease Alerts</span>
          <span className="stat-value">{criticalCount}</span>
          <span className="stat-subtext">Severe infection events</span>
        </div>
      </div>

      {/* CARD 3: Total Disease Detections */}
      <div className="stat-card">
        <div className="stat-icon-wrap stat-icon-blue">🔍</div>
        <div className="stat-info">
          <span className="stat-label">Total Disease Detections</span>
          <span className="stat-value">{totalDetections}</span>
          <span className="stat-subtext">Cumulative stream findings</span>
        </div>
      </div>

      {/* CARD 4: Active Video Streams */}
      <div className="stat-card">
        <div className="stat-icon-wrap stat-icon-purple">📹</div>
        <div className="stat-info">
          <span className="stat-label">Active Video Streams</span>
          <span className="stat-value">{activeStreamsCount}</span>
          <span className="stat-subtext">{isStreamActive ? "Live feed active" : "No active stream"}</span>
        </div>
      </div>
    </div>
  );
}
