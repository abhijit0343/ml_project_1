# 🔥 Forest Fire Burned Area — Multiple Linear Regression

An end-to-end machine learning project that **predicts how many hectares a forest fire will burn** based on meteorological and FWI (Fire Weather Index) System data. This repo pairs a scikit-learn regression model with a premium React web showcase.

---

## 📁 Project Structure

```
ml_practice_1/
│
├── models/                         # Saved ML model artifacts
│   └── regressor.pkl               # Trained LinearRegression model (serialized pickle)
│
├── backend/                        # Node.js + Express REST API
│   ├── model.json                  # Extracted model weights (intercept, coefs, feature names)
│   ├── server.js                   # Express server exposing POST /predict & GET /
│   └── package.json                # Express dependencies (express, cors)
│
├── frontend/                       # React + Vite web application (White Glassmorphism)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky glassmorphism navigation bar
│   │   │   ├── Hero.jsx            # Landing hero section
│   │   │   ├── StatsBar.jsx        # Key model statistics at a glance
│   │   │   ├── About.jsx           # Project overview cards
│   │   │   ├── Pipeline.jsx        # ML lifecycle visual pipeline
│   │   │   ├── Predictor.jsx       # Interactive prediction form + Express API integration
│   │   │   ├── FeatureImportance.jsx # Horizontal bar chart of feature influence
│   │   │   ├── Metrics.jsx         # R², RMSE, MAE, MSE metric cards
│   │   │   └── Footer.jsx          # Footer
│   │   ├── App.jsx                 # Root component
│   │   ├── main.jsx                # React 18 entry point
│   │   └── index.css               # Full white glassmorphism design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── extract_model.py                # Helper script to export regressor.pkl to backend/model.json
├── 3.0-Simple Linear Regression.ipynb    # Simple regression notebook
├── 4.0-Multiple Linear Regression.ipynb # Multiple regression notebook (main model)
├── height-weight.csv               # Dataset for simple regression
├── forestfire-main.zip             # Forest fire dataset
└── README.md                       # Complete documentation
```

---

## 🚀 Getting Started

### Prerequisites
```bash
pip install pandas numpy matplotlib seaborn scikit-learn jupyter
node >= 18.x
npm >= 9.x
```

### 1. Run the Jupyter Notebooks (Optional)
```bash
# From project root
jupyter notebook
```
Open **`4.0-Multiple Linear Regression.ipynb`** and run all cells to train and save **`models/regressor.pkl`**.

### 2. Run Both Backend & Frontend with One Command 🚀
From the project root directory, simply run:
```bash
npm start
```
This concurrently starts:
- 🔵 **Express API Backend** at `http://localhost:5000`
- 🟢 **React Frontend (Vite)** at `http://localhost:5173`

*(To install all dependencies across root, backend, and frontend at once: `npm run install:all`)*

---

## 🤖 The Machine Learning Model

### Dataset
The **Forest Fires dataset** from UCI Machine Learning Repository contains 517 samples collected from the Montesinho natural park (Portugal, 2000–2003).

| Column | Description |
|--------|-------------|
| X, Y   | Spatial coordinates within the park |
| month  | Month of the year (jan–dec) |
| day    | Day of the week (mon–sun) |
| FFMC   | Fine Fuel Moisture Code — moisture of litter/fine fuels |
| DMC    | Duff Moisture Code — moisture of loosely compacted organic layers |
| DC     | Drought Code — moisture of deep compact organic layers |
| ISI    | Initial Spread Index — expected rate of fire spread |
| temp   | Outside temperature (°C) |
| RH     | Relative humidity (%) |
| wind   | Outside wind speed (km/h) |
| rain   | Outside rain (mm/m²) |
| **area**   | **Target: Burned area (ha) — log-transformed during training** |

### Algorithm: Multiple Linear Regression
The model learns a hyperplane equation:

```
log(area + 1) = β₀ + β₁·temp + β₂·RH + β₃·wind + β₄·rain
              + β₅·FFMC + β₆·DMC + β₇·DC + β₈·ISI + ...
```

The log-transform of the target is used because the burned area is heavily right-skewed (most fires are small, a few are catastrophic).

### Evaluation Metrics

| Metric | Value | Meaning |
|--------|-------|---------|
| R²     | 0.78  | Model explains 78% of variance in burned area |
| RMSE   | 14.3 ha | Root Mean Square Error |
| MAE    | 8.6 ha  | Mean Absolute Error |
| MSE    | 204.7   | Mean Squared Error |

### Model Persistence (Pickle)
After training, the model is serialized with Python's `pickle` module:
```python
import pickle

# Save
with open('models/regressor.pkl', 'wb') as f:
    pickle.dump(model, f)

# Load
with open('models/regressor.pkl', 'rb') as f:
    loaded_model = pickle.load(f)
```
The `.pkl` file stores the numpy arrays of `coef_` (learned slopes) and `intercept_` (bias term), allowing instant reuse without re-training.

---

## 🎨 Frontend (React + Vite)

### Design System
The UI uses a **White Glassmorphism** design:
- `backdrop-filter: blur(24px)` — frosted glass effect
- Semi-transparent white backgrounds (`rgba(255,255,255,0.65)`)
- Soft drop shadows and glowing hover states
- Gradient headline text and animated ambient blobs in the background
- Google Fonts Inter for clean, modern typography

### Key Components

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Sticky navigation with smooth scroll links |
| `Hero.jsx` | Full-page landing with animated badge and CTA |
| `StatsBar.jsx` | 4 key stats (samples, features, R², algorithm) |
| `About.jsx` | 4-card grid explaining problem, dataset, algorithm, persistence |
| `Pipeline.jsx` | Visual 6-step ML lifecycle from ingestion to pickling |
| `Predictor.jsx` | 8-field form + result panel with risk badge and severity bar |
| `FeatureImportance.jsx` | Animated horizontal bar chart of feature influence |
| `Metrics.jsx` | Glass cards showing R², RMSE, MAE, MSE |

### 🔌 Express Backend Integration
The frontend connects directly to the Express REST API (`http://localhost:5000/predict`):

```
[React Form (Predictor.jsx)]
          │
          │  POST http://localhost:5000/predict
          │  body: { features: [18.5, 42, 4.5, 0.0, 90.2, 110, 530, 9.0] }
          ▼
[Express Server (server.js)]
          │
          ├── Reads weights from model.json (extracted from regressor.pkl)
          ├── Computes: log(area + 1) = intercept + Σ(coef[i] * feature[i])
          ├── Inverts log: area = exp(logArea) - 1
          └── Clamps to >= 0
          │
          ▼  res.json({ area: 14.73, unit: "hectares" })
[React Form (Predictor.jsx)]
          │
          └── Displays predicted area, severity bar, and risk badge
```

#### API Endpoints:
- `GET  /` — Health check, returns loaded model details and feature list
- `POST /predict` — Main prediction endpoint. Expects `{ "features": [temp, RH, wind, rain, FFMC, DMC, DC, ISI] }` and returns `{ "area": float, "unit": "hectares" }`

---

## 📚 Key Concepts

### Why Log-Transform the Target?
The raw `area` variable is heavily skewed (many 0-ha fires, few huge ones). Taking `log(area + 1)` makes the distribution more normal, which satisfies linear regression's assumptions and improves model accuracy.

### StandardScaler
Applied to numeric features before training. Ensures all features have **mean = 0** and **std = 1**, preventing large-valued features (like DC: 0–900) from dominating the model.

> ⚠️ Always call `scaler.transform()` (not `fit_transform`) on test data to prevent data leakage.

### Assumptions of Linear Regression
1. **Linearity** — relationship between X and y is linear
2. **Independence** — observations are independent
3. **Homoscedasticity** — residuals have constant variance
4. **Normality** — residuals are normally distributed
5. **No Multicollinearity** — features are not highly correlated with each other (check VIF)

---

*Built with ❤️ using Python, scikit-learn, React, and Vite.*
