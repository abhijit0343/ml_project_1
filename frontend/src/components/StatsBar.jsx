import React from 'react'

const stats = [
  { value: '517', label: 'Training Samples' },
  { value: '12', label: 'Features Used' },
  { value: '78%', label: 'R² Score' },
  { value: 'MLR', label: 'Algorithm' },
]

export default function StatsBar() {
  return (
    <section className="stats-bar fade-in fade-in-2">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="glass-card stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
