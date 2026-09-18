import React from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import About from './components/About'
import Pipeline from './components/Pipeline'
import Predictor from './components/Predictor'
import FeatureImportance from './components/FeatureImportance'
import Metrics from './components/Metrics'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <About />
        <Pipeline />
        <Predictor />
        <section className="section fade-in fade-in-4">
          <div className="container">
            <FeatureImportance />
          </div>
        </section>
        <Metrics />
      </main>
      <Footer />
    </>
  )
}
