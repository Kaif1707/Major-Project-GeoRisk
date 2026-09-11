# GeoRisk Analytics — Demonstration Script & Viva Q&A Guide

This document provides a structured walkthrough script for live demonstrations, presentations, and technical viva Q&A defense.

---

## Part 1: Live Demonstration Flow (10-Minute Walkthrough)

### 1. Landing Page & Value Proposition (1 min)
- **Action**: Open `http://localhost:3000/`.
- **Narration**: *"GeoRisk Analytics is an enterprise platform monitoring sovereign geopolitical and economic risk across 195 sovereign nations."*
- **Highlight**: Dark terminal design aesthetic, live feature badges, and single-click authentication.

### 2. Global Risk Intelligence Dashboard (2 min)
- **Action**: Click "Enter Terminal" or navigate to `/app/dashboard`.
- **Highlight**:
  - Live KPI Cards: Global Average Risk Score (41.8/100), 195 Monitored Sovereign Nations, Highest Risk Escalation (Ukraine), Safest Investment Haven (United States).
  - Recharts Suite: Risk Distribution Donut Chart and Top 10 Safest vs Riskiest Bar Chart.
  - Interactive Country Risk Datatable with search, region dropdown, category filter, and column sorting.

### 3. Interactive GIS World Map (2 min)
- **Action**: Navigate to `/app/map`.
- **Highlight**:
  - Leaflet GIS vector map with CARTO Dark tiles.
  - Circle markers color-coded by backend GeoRisk category thresholds (`Very Low` Green, `Low` Light Green, `Moderate` Yellow, `Elevated` Orange, `High` Red, `Extreme` Dark Red).
  - Hover over a country (e.g. United States or Germany) to showcase the interactive popup displaying flag, ISO code, GeoRisk Index, and Economic/Political/Business sub-scores.

### 4. Multi-Country Comparison Studio (1.5 min)
- **Action**: Navigate to `/app/compare`.
- **Highlight**:
  - Select 3 countries (e.g. USA, Germany, India).
  - Automated Takeaways Banner (*Safest Haven*, *Highest Risk Vector*, *Strongest Economy*, *Best Political Stability*).
  - Overlaid 8-dimension Recharts Radar chart.
  - Side-by-side comparative indicator matrix table.

### 5. AI Intelligence Assistant & Time-Series Forecasting (2 min)
- **Action**: Navigate to `/app/ai-assistant` and `/app/forecast`.
- **Highlight**:
  - AI Assistant: Submit prompt "Compare United States and Germany" or "Which Asian countries are safest?". Show RAG response with grounding confidence score and source tags.
  - Forecasting Studio: Select USA, switch horizons (30D, 90D, 180D, 365D), demonstrate Recharts prediction line chart with 95% confidence corridor area.
  - Scenario Simulator: Adjust GDP growth or inflation sliders and click "Calculate Stress Shift" to display predicted score delta.

### 6. Productivity & Admin Control Panel (1.5 min)
- **Action**: Navigate to `/app/watchlists`, `/app/reports`, and `/app/admin`.
- **Highlight**: Custom watchlists, automated alert rules, executive report generator (PDF, CSV, JSON exports), user management, weight studio, manual ETL trigger, and audit logs.

---

## Part 2: Technical Viva Q&A Preparation

### Q1: How is the GeoRisk Index calculated?
> **Answer**: The GeoRisk Index is a normalized 0.0–100.0 score computed across 8 weighted risk dimensions: Economic (30%), Political (25%), Business (15%), Social (10%), Conflict (10%), Trade (5%), Currency (3%), and External Relations (2%). Each indicator metric is normalized using MinMax feature scaling. For safety-oriented metrics like GDP growth, metric inversion scaling is applied so that a higher raw value yields a lower risk score.

### Q2: How does the AI Assistant avoid hallucination?
> **Answer**: The AI Assistant utilizes a Retrieval-Augmented Generation (RAG) architecture. When a user submits a natural language question, the system queries the live PostgreSQL database for country risk scores, sub-scores, indicator history, and news summaries, passing these verified facts as context to formulate grounded answers with explicit confidence scores and source citations.

### Q3: How is data refreshed and cleansed in the ETL pipeline?
> **Answer**: The ETL pipeline connects to World Bank and IMF REST endpoints via Python connectors. It validates raw metrics against plausible numerical range bounds, applies outlier smoothing, imputes missing historical values using adjacent series averaging, and loads clean records into PostgreSQL.

### Q4: How is security handled for administrative actions?
> **Answer**: All endpoints under `/admin/*` enforce RBAC dependencies requiring `admin` or `super_admin` permissions. Every administrative action—such as creating accounts, modifying scoring weights, or clearing system caches—is recorded in the `audit_logs` table with user IDs, timestamps, and IP addresses.
