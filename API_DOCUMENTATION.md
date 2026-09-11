# GeoRisk Analytics — REST API Documentation

Base URL: `/api/v1`

---

## 1. Authentication & Users (`/auth`, `/users`)
- `POST /auth/login` — Authenticate user and issue JWT Access + Refresh Tokens
- `POST /auth/register` — Register new user account
- `POST /auth/refresh` — Refresh access token via valid refresh token
- `POST /auth/logout` — Revoke active refresh token
- `GET /users/me` — Retrieve current authenticated user profile & permissions

---

## 2. GeoRisk Scoring Engine (`/risk`)
- `GET /risk` — Paginated sovereign risk scores (supports region, category, score range, search, sort)
- `GET /risk/rankings` — Global risk rankings, top safest, and highest risk leaderboards
- `GET /risk/categories` — System risk category threshold definitions
- `GET /risk/{country_code}` — Country GeoRisk score and 8 dimension sub-scores
- `GET /risk/breakdown/{country_code}` — Factor contribution breakdown matrix
- `POST /risk/recalculate/all` — Trigger global risk score recalculation

---

## 3. GIS Map & Multi-Country Comparison (`/map`, `/compare`)
- `GET /map/countries` — GeoJSON feature dataset for choropleth map rendering
- `POST /compare` — Multi-country side-by-side risk analysis (2 to 5 countries)

---

## 4. News & AI Intelligence (`/news`, `/ai`)
- `GET /news` — Paginated geopolitical news feed with sentiment labels
- `GET /news/trending` — Top high-impact geopolitical escalations
- `POST /ai/chat` — Conversational RAG GeoRisk AI Assistant query endpoint

---

## 5. Forecasting & Scenario Simulation (`/forecast`)
- `POST /forecast/{country_code}` — Time-series forecast model (30d, 90d, 180d, 365d)
- `POST /forecast/scenario` — What-if macro stress event simulation

---

## 6. Watchlists, Alerts & Reports (`/watchlists`, `/alerts`, `/reports`)
- `GET /watchlists` — User watchlists
- `POST /alerts/rules` — Configure risk threshold alert rules
- `POST /reports/generate` — Generate executive report brief (PDF, CSV, JSON)
