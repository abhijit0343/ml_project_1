import React from 'react'

export default function Hero() {
  return (
    <section id="hero" className="hero fade-in">
      <div className="container">
        <div className="hero-badge">
          <span className="dot" aria-hidden="true"></span>
          Machine Learning Project
        </div>
        <h1>
          Forest Fire <span className="gradient-text">Burned Area</span><br />
          Prediction Model
        </h1>
        <p className="hero-desc">
          A Multiple Linear Regression model trained on meteorological and
          environmental data from the Montesinho park in Portugal to predict
          how much area a forest fire will burn.
        </p>
        <div className="hero-actions">
          <a href="#predictor" className="btn btn-primary" id="hero-try-btn">
            🔮 Try the Predictor
          </a>
          <a href="#about" className="btn btn-ghost" id="hero-learn-btn">
            Learn How It Works
          </a>
        </div>
      </div>
    </section>
  )
}
