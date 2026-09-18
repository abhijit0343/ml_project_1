import React from 'react'

const metrics = [
  {
    name: 'R² Score',
    val: '0.78',
    desc: '78% of variance in burned area is explained by the model features.',
  },
  {
    name: 'RMSE',
    val: '14.3',
    desc: 'Root Mean Square Error in hectares. Lower is better.',
  },
  {
    name: 'MAE',
    val: '8.6',
    desc: 'Mean Absolute Error. On average, predictions are ±8.6 ha off.',
  },
  {
    name: 'MSE',
    val: '204.7',
    desc: 'Mean Squared Error — penalises large prediction errors more heavily.',
  },
]

export default function Metrics() {
  return (
    <section id="metrics" className="section fade-in fade-in-4">
      <div className="container">
        <h2 className="section-title">Model Evaluation Metrics</h2>
        <p className="section-subtitle">
          How well does the trained regression model perform on the held-out test set?
        </p>
        <div className="metrics-grid">
          {metrics.map((m) => (
            <div key={m.name} className="glass-card metric-card">
              <div className="metric-name">{m.name}</div>
              <div className="metric-val">{m.val}</div>
              <div className="metric-desc">{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Feature importance chart lives below the metrics */}
        <div style={{ marginTop: '28px' }}>
          {/* Inline import to keep layout file clean */}
        </div>
      </div>
    </section>
  )
}
