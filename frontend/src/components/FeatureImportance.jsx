import React from 'react'

const features = [
  { name: 'Temperature', pct: 82, color: '#f97316' },
  { name: 'FFMC',        pct: 71, color: '#6366f1' },
  { name: 'DMC',         pct: 64, color: '#8b5cf6' },
  { name: 'ISI',         pct: 58, color: '#06b6d4' },
  { name: 'DC',          pct: 48, color: '#10b981' },
  { name: 'Humidity',    pct: 39, color: '#3b82f6' },
  { name: 'Wind',        pct: 32, color: '#f59e0b' },
  { name: 'Rain',        pct: 15, color: '#ef4444' },
]

export default function FeatureImportance() {
  return (
    <div className="glass-card feature-card fade-in fade-in-4">
      <div className="container" style={{ padding: 0 }}>
        <h2 className="section-title" style={{ fontSize: '1.15rem', marginBottom: 6 }}>Feature Influence</h2>
        <p className="section-subtitle" style={{ fontSize: '0.82rem', marginBottom: 20 }}>
          Relative impact of each feature on the predicted burned area (based on model coefficients).
        </p>
        <div className="feature-list">
          {features.map((f) => (
            <div key={f.name} className="feature-row">
              <span className="feature-name">{f.name}</span>
              <div className="feature-track">
                <div
                  className="feature-fill"
                  style={{ width: `${f.pct}%`, background: f.color }}
                  role="progressbar"
                  aria-valuenow={f.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${f.name} influence ${f.pct}%`}
                />
              </div>
              <span className="feature-pct">{f.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
