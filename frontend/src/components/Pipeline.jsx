import React from 'react'

const steps = [
  { num: '1', label: 'Data Ingestion', desc: 'Load CSV with pandas' },
  { num: '2', label: 'EDA', desc: 'Scatter plots & heatmaps' },
  { num: '3', label: 'Preprocessing', desc: 'Scale & train-test split' },
  { num: '4', label: 'Model Fit', desc: 'LinearRegression().fit()' },
  { num: '5', label: 'Evaluation', desc: 'R², RMSE, MAE' },
  { num: '6', label: 'Pickle', desc: 'Save as .pkl file' },
]

export default function Pipeline() {
  return (
    <section id="pipeline" className="section fade-in fade-in-3">
      <div className="container">
        <h2 className="section-title">ML Lifecycle Pipeline</h2>
        <p className="section-subtitle">
          Every step from raw data to a saved, reusable model artifact.
        </p>
        <div className="glass-card" style={{ padding: '8px', overflow: 'auto' }}>
          <div className="pipeline">
            {steps.map((s) => (
              <div key={s.num} className="pipeline-step">
                <div className="step-num">{s.num}</div>
                <div className="step-label">{s.label}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
