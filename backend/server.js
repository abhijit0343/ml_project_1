/**
 * server.js — Express backend for the Forest Fire Regressor
 * ==========================================================
 *
 * HOW IT WORKS:
 *   1. Loads model.json (real coefficients extracted from regressor.pkl)
 *   2. Exposes a POST /predict endpoint
 *   3. Receives 8 weather/FWI features from React
 *   4. Applies the linear regression equation in JavaScript
 *   5. Reverses the log-transform to get hectares
 *   6. Returns the result as JSON back to React
 *
 * Run:  node server.js   (from the backend/ folder)
 * Port: http://localhost:5000
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

// ── Load the trained model coefficients (extracted from regressor.pkl) ──────
const model = require("./model.json");
// model.intercept → the bias term β₀
// model.coef      → array of slopes [β₁, β₂, ..., β₈]
// model.feature_names → ["temp", "RH", "wind", "rain", "FFMC", "DMC", "DC", "ISI"]

console.log("Model loaded:");
console.log("  Intercept :", model.intercept);
console.log("  Features  :", model.feature_names);

// ── Create Express app ───────────────────────────────────────────────────────
const app = express();

// Middlewares
app.use(cors());              // allow React (port 5173) to call this API
app.use(express.json());      // parse incoming JSON request bodies

// ── Helper: run the linear regression equation ───────────────────────────────
/**
 * Computes:  log(area + 1) = intercept + Σ(coef[i] * feature[i])
 * Then reverses: area = e^(result) - 1
 *
 * @param {number[]} features - array of 8 numbers [temp, RH, wind, rain, FFMC, DMC, DC, ISI]
 * @returns {number} predicted burned area in hectares
 */
function predict(features) {
  // Step 1: dot product of coefficients and input features, plus intercept
  const logArea = model.intercept + model.coef.reduce((sum, coef, i) => {
    return sum + coef * features[i];
  }, 0);

  // Step 2: reverse the log(area + 1) transform the notebook applied to the target
  const area = Math.exp(logArea) - 1;

  // Step 3: clamp to 0 (area can never be negative)
  return Math.max(0, area);
}

// ── Routes ───────────────────────────────────────────────────────────────────

// GET / — health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    model: "Forest Fire LinearRegression (Express)",
    features: model.feature_names,
  });
});

// POST /predict — main prediction endpoint
app.post("/predict", (req, res) => {
  /**
   * Expected request body (from React):
   *   { "features": [temp, RH, wind, rain, FFMC, DMC, DC, ISI] }
   *
   * Example:
   *   { "features": [25, 55, 6.0, 0.0, 91.7, 145, 600, 10.5] }
   *
   * Response:
   *   { "area": 14.73, "unit": "hectares", "features_received": [...] }
   */

  const { features } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────
  if (!features || !Array.isArray(features)) {
    return res.status(400).json({
      error: "Request body must have a 'features' array.",
      example: { features: [25, 55, 6.0, 0.0, 91.7, 145, 600, 10.5] },
    });
  }

  if (features.length !== model.feature_names.length) {
    return res.status(400).json({
      error: `Expected ${model.feature_names.length} features, received ${features.length}.`,
      expected_order: model.feature_names,
    });
  }

  const allNumbers = features.every((f) => typeof f === "number" && !isNaN(f));
  if (!allNumbers) {
    return res.status(400).json({ error: "All features must be valid numbers." });
  }

  // ── Run prediction ──────────────────────────────────────────────────────
  const area = predict(features);

  // ── Build response ──────────────────────────────────────────────────────
  const response = {
    area: parseFloat(area.toFixed(2)),     // e.g. 14.73
    unit: "hectares",
    features_received: model.feature_names.reduce((obj, name, i) => {
      obj[name] = features[i];             // e.g. { temp: 25, RH: 55, ... }
      return obj;
    }, {}),
  };

  console.log(`[${new Date().toISOString()}] Prediction:`, response.area, "ha");
  res.json(response);
});

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
  console.log(`  GET  http://localhost:${PORT}/        → health check`);
  console.log(`  POST http://localhost:${PORT}/predict → prediction`);
});
