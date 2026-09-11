# GeoRisk Analytics — Sovereign Geopolitical & Economic Risk Platform

[![CI/CD Pipeline](https://github.com/georisk/georisk-analytics/actions/workflows/ci.yml/badge.svg)](https://github.com/georisk/georisk-analytics/actions)
[![Production Ready](https://img.shields.io/badge/status-production_ready-emerald.svg)](https://georisk.internal)
[![License: Proprietary](https://img.shields.io/badge/license-Enterprise-blue.svg)](LICENSE)

**GeoRisk Analytics** is an enterprise-grade SaaS intelligence platform providing real-time quantitative geopolitical risk scores, macroeconomic monitoring, multidimensional risk vectors, time-series forecasting, and conversational RAG AI analysis across **195 sovereign nations**.

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (Dark Slate Theme `#0B0F17`), Recharts, Leaflet & React Leaflet, Lucide Icons, TanStack Query v5, Axios, React Router v6.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM, Alembic, PostgreSQL 16, Redis 7.
- **Architecture**: Modular Monorepo, JWT RBAC Token Rotation, RAG GeoRisk AI Assistant, Leaflet GIS Vector Map, Automated ETL Pipeline (World Bank & IMF APIs).

---

## Key Features

1. **Sovereign Risk Matrix**: 0.0–100.0 GeoRisk Index normalized across 8 dimensions (Economic, Political, Business, Social, Conflict, Trade, Currency, External Relations).
2. **Interactive GIS Heatmap**: Leaflet vector world map color-coded by risk category thresholds with hover tooltips.
3. **Multi-Country Comparison Studio**: Benchmark 2 to 5 countries side-by-side with overlaid Recharts Radar charts and comparative takeaway banners.
4. **Time-Series Forecasting & What-If Simulator**: Predict 30D to 365D risk trajectories with 95% confidence corridors and stress-test synthetic macro events.
5. **RAG GeoRisk AI Assistant**: Natural language AI analyst (`POST /api/v1/ai/chat`) providing grounded risk briefs using live database context.
6. **Enterprise Productivity**: Custom watchlists, automated threshold alerts, in-app notification center, CSV/JSON exports, and executive PDF briefs.
7. **Admin Control Panel**: Centralized management for users, roles, GeoRisk dimension weights, manual ETL triggers, and audit logs.

---

## Quickstart Guide

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ & Python 3.11+

### Running with Docker Compose (Recommended)
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```
Access the application at:
- **Frontend SPA**: `http://localhost:80`
- **FastAPI API & Docs**: `http://localhost:8000/docs`

### Manual Development Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python app/database/seed.py
python app/database/seed_countries.py
python app/database/seed_risk_rules.py
python app/database/seed_news_forecast.py
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## Documentation Links

- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](API_DOCUMENTATION.md)
- [System Architecture & Mermaid Diagrams](ARCHITECTURE.md)
- [Full Changelog & Version Notes](CHANGELOG.md)
