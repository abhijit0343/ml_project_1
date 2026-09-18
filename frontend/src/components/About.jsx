import React from 'react'

const cards = [
  {
    icon: '🌲',
    iconClass: 'blue',
    title: 'The Problem',
    body: 'Forest fires cause massive ecological and economic damage. Early prediction of the burned area helps firefighters and emergency response teams allocate resources effectively.',
  },
  {
    icon: '📊',
    iconClass: 'violet',
    title: 'The Dataset',
    body: 'Data collected from the Montesinho natural park in Portugal (Jan 2000 – Dec 2003). It includes spatial coordinates, season/month, weather conditions (temp, humidity, wind, rain) and FWI indices.',
  },
  {
    icon: '⚙️',
    iconClass: 'cyan',
    title: 'The Algorithm',
    body: 'Multiple Linear Regression finds the best-fit hyperplane y = β₀ + β₁X₁ + β₂X₂ + … + βₙXₙ by minimising the residual sum of squares (RSS) across all features simultaneously.',
  },
  {
    icon: '💾',
    iconClass: 'rose',
    title: 'Model Persistence',
    body: 'After training, the model is serialized to a .pkl file using Python\'s pickle module. This allows instant predictions later without re-training—the saved file is stored in the models/ directory.',
  },
]

export default function About() {
  return (
    <section id="about" className="section fade-in fade-in-2">
      <div className="container">
        <h2 className="section-title">Project Overview</h2>
        <p className="section-subtitle">
          Understanding the problem, data, and approach behind the regression model.
        </p>
        <div className="about-grid">
          {cards.map((c) => (
            <div key={c.title} className="glass-card about-card">
              <div className={`about-icon ${c.iconClass}`} aria-hidden="true">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
