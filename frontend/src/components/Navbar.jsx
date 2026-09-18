import React from 'react'

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <a href="#hero" className="navbar-brand">
          ForestML
        </a>
        <ul className="navbar-links" role="list">
          <li><a href="#about">About</a></li>
          <li><a href="#pipeline">Pipeline</a></li>
          <li><a href="#predictor">Predictor</a></li>
          <li><a href="#metrics">Metrics</a></li>
        </ul>
      </div>
    </nav>
  )
}
