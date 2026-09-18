import React, { useState } from 'react'

// Express backend URL
const API_URL = "http://localhost:5000/predict";
const MAX_AREA = 1090.84; // Max burned area observed in dataset


const fields = [
  { key: 'temp',  label: 'Temperature', unit: '°C',   min: 0,   max: 50,  step: 0.1, placeholder: '18.5', tip: 'Outside temperature' },
  { key: 'RH',   label: 'Humidity',     unit: '%',    min: 0,   max: 100, step: 1,   placeholder: '42',   tip: 'Relative humidity' },
  { key: 'wind', label: 'Wind Speed',   unit: 'km/h', min: 0,   max: 20,  step: 0.1, placeholder: '4.5',  tip: 'Wind speed' },
  { key: 'rain', label: 'Rainfall',     unit: 'mm',   min: 0,   max: 10,  step: 0.1, placeholder: '0.0',  tip: 'Outside rain' },
  { key: 'FFMC', label: 'FFMC Index',   unit: '',     min: 0,   max: 100, step: 0.1, placeholder: '90.2', tip: 'Fine Fuel Moisture Code' },
  { key: 'DMC',  label: 'DMC Index',    unit: '',     min: 0,   max: 300, step: 1,   placeholder: '110',  tip: 'Duff Moisture Code' },
  { key: 'DC',   label: 'DC Index',     unit: '',     min: 0,   max: 900, step: 1,   placeholder: '530',  tip: 'Drought Code' },
  { key: 'ISI',  label: 'ISI Index',    unit: '',     min: 0,   max: 60,  step: 0.1, placeholder: '9.0',  tip: 'Initial Spread Index' },
]

const defaultValues = {
  temp: '', RH: '', wind: '', rain: '',
  FFMC: '', DMC: '', DC: '', ISI: '',
}

function getRiskLabel(area) {
  if (area < 1)   return { label: 'Minimal',  color: '#10b981' }
  if (area < 10)  return { label: 'Low',       color: '#22c55e' }
  if (area < 50)  return { label: 'Moderate',  color: '#f59e0b' }
  if (area < 200) return { label: 'High',      color: '#f97316' }
  return             { label: 'Severe',     color: '#ef4444' }
}

export default function Predictor() {
  const [values, setValues] = useState(defaultValues)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
  }

  const allFilled = Object.values(values).every((v) => v !== '')

  const handlePredict = async () => {
    if (!allFilled) return
    setLoading(true)
    try {
      // Send the 8 features to Express in the order the model expects
      const features = [
        parseFloat(values.temp),
        parseFloat(values.RH),
        parseFloat(values.wind),
        parseFloat(values.rain),
        parseFloat(values.FFMC),
        parseFloat(values.DMC),
        parseFloat(values.DC),
        parseFloat(values.ISI),
      ]

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Server error')
      }

      const data = await response.json()  // { area: 14.73, unit: 'hectares' }
      setResult(data.area)
    } catch (err) {
      alert(`Prediction failed: ${err.message}\n\nMake sure the Express server is running:\n  cd backend && node server.js`)
    } finally {
      setLoading(false)
    }
  }

  const risk = result !== null ? getRiskLabel(result) : null
  const fillPct = result !== null ? Math.min(100, (Math.log1p(result) / Math.log1p(MAX_AREA)) * 100) : 0

  return (
    <section id="predictor" className="section fade-in fade-in-3">
      <div className="container">
        <h2 className="section-title">Live Predictor</h2>
        <p className="section-subtitle">
          Enter meteorological conditions to estimate the burned area using the trained regression model.
        </p>

        <div className="predictor-grid">
          {/* Form */}
          <div className="glass-card predictor-form">
            <div className="form-title">Input Features</div>
            <div className="form-subtitle">Based on FWI System + Weather data</div>
            <div className="form-grid">
              {fields.map((f) => (
                <div key={f.key} className="form-group">
                  <label className="form-label" htmlFor={`input-${f.key}`} title={f.tip}>
                    {f.label}
                    {f.unit && <span className="form-unit">({f.unit})</span>}
                  </label>
                  <input
                    id={`input-${f.key}`}
                    className="form-input"
                    type="number"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    placeholder={f.placeholder}
                    value={values[f.key]}
                    onChange={handleChange(f.key)}
                    aria-label={f.label}
                  />
                </div>
              ))}
            </div>
            <button
              id="predict-btn"
              className="btn btn-primary btn-predict"
              onClick={handlePredict}
              disabled={!allFilled || loading}
              aria-label="Run prediction"
            >
              {loading
                ? <><span className="spinner" aria-hidden="true"></span> Predicting…</>
                : '🔮 Predict Burned Area'
              }
            </button>
          </div>

          {/* Result */}
          <div className="glass-card result-panel">
            {result === null ? (
              <div className="result-placeholder">
                <div className="placeholder-icon" aria-hidden="true">📊</div>
                <p>Fill in all input fields and click <strong>Predict</strong> to see the estimated burned area.</p>
              </div>
            ) : (
              <div className="result-content">
                <div className="result-header">
                  <h3>Prediction Result</h3>
                  <span
                    className="result-badge success"
                    style={{ background: `${risk.color}18`, color: risk.color }}
                  >
                    ✓ {risk.label} Risk
                  </span>
                </div>

                <div className="result-big">
                  <span className="result-value">{result.toLocaleString()}</span>
                  <span className="result-unit">hectares burned (estimated)</span>
                </div>

                <div className="interpretation">
                  <h4>Severity Scale</h4>
                  <div className="interp-bar">
                    <div className="interp-track" role="progressbar" aria-valuenow={fillPct} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="interp-fill"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="interp-label">{fillPct.toFixed(0)}% of max</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  ⚡ Live predictions powered by the <strong>Express backend</strong> (<code>http://localhost:5000</code>) using real regression coefficients extracted from <code>regressor.pkl</code>.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
