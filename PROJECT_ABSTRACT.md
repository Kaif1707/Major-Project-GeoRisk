# GeoRisk Analytics — Sovereign Geopolitical & Economic Risk Intelligence Platform

## Academic Project Abstract

**Project Title**: GeoRisk Analytics: An Automated Multidimensional Quantitative Framework for Sovereign Geopolitical & Macroeconomic Risk Assessment  
**Domain**: Data Engineering, Financial Intelligence, Machine Learning & Web Engineering  
**Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Leaflet GIS, Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PostgreSQL 16, Redis 7.

---

### 1. Abstract
In an increasingly volatile global macroeconomic climate, institutional investors, multinational corporations, and policymakers require transparent, real-time, and quantitative insights into sovereign risk exposure. Traditional risk models rely heavily on static subjective credit ratings and fragmented indicator sets. 

**GeoRisk Analytics** resolves these limitations by introducing a high-performance, automated intelligence platform that ingests, cleanses, and normalizes sovereign macroeconomic, political stability, social, conflict, trade, currency, and external relation indicators across **195 sovereign nations**. Utilizing MinMax feature scaling with automatic metric inversion handling, the platform computes a dynamic **0.0–100.0 GeoRisk Index**. The architecture combines an interactive Leaflet GIS choropleth heatmap, multi-country comparison studio, predictive time-series forecasting engine (30d–365d horizons with 95% confidence corridors), what-if scenario simulator, RAG-grounded conversational AI risk assistant, and enterprise productivity tools (watchlists, threshold alerts, PDF/CSV executive reports, and audit-logged RBAC administration).

---

### 2. Problem Statement
Global sovereign risk evaluation faces three critical challenges:
1. **Data Fragmentation**: Macroeconomic indicators, political stability measures, and trade balances are scattered across incompatible APIs (World Bank, IMF, GDELT) with varying reporting intervals and missing values.
2. **Opacity & Metric Biases**: Traditional sovereign risk ratings lack algorithmic transparency and fail to account for inverse risk metrics (e.g. GDP growth reduction vs inflation increase).
3. **Lagging Actionability**: Static annual reports prevent financial managers from stress-testing synthetic macro shocks or receiving automated risk escalation alerts in real time.

---

### 3. Objectives & Core Modules
1. **Automated ETL Data Pipeline**: Scheduled ingestion, outlier validation, missing value imputation, and relational loading into PostgreSQL.
2. **Dynamic GeoRisk Engine**: Weighted aggregation across 8 risk dimensions (Economic 30%, Political 25%, Business 15%, Social 10%, Conflict 10%, Trade 5%, Currency 3%, External Relations 2%).
3. **Interactive Geographical Visualizations**: Leaflet GIS choropleth vector map and Recharts 8-dimension vector Radar charts.
4. **Multi-Country Comparison Studio**: Side-by-side benchmarking for 2 to 5 countries with automated takeaways.
5. **Time-Series Forecasting & Stress Simulator**: Predictive linear regression and exponential smoothing with 95% confidence corridor bands and what-if parameter sliders.
6. **RAG Conversational AI Assistant**: Contextual natural language risk briefing generator (`POST /api/v1/ai/chat`).
7. **Enterprise Productivity & Administration**: Custom watchlists, automated threshold alerts, multi-format executive exports (PDF, CSV, JSON), and audit-logged RBAC administration.

---

### 4. Mathematical Methodology & Scoring Engine
Let $x_{i,j}$ be the raw value of indicator metric $j$ for country $i$. The normalized risk score $S_{i,j} \in [0, 100]$ is computed via MinMax scaling:

$$\text{Direct Metric (e.g., Inflation): } S_{i,j} = \left( \frac{x_{i,j} - x_{\min,j}}{x_{\max,j} - x_{\min,j}} \right) \times 100$$

$$\text{Inverted Metric (e.g., GDP Growth): } S_{i,j} = \left( 1.0 - \frac{x_{i,j} - x_{\min,j}}{x_{\max,j} - x_{\min,j}} \right) \times 100$$

The overall GeoRisk Index $R_i$ for country $i$ is calculated as the weighted sum across dimensions $d \in D$:

$$R_i = \sum_{d \in D} w_d \cdot S_{i,d}$$

Where $\sum_{d \in D} w_d = 1.0$.

---

### 5. Empirical Results & Performance
- **Data Coverage**: 195 sovereign nations across 6 global continents.
- **Pipeline Throughput**: 100% successful ingestion across 780 indicator series from World Bank & IMF endpoints.
- **Frontend Performance**: 2,494 React modules compiled into minified production bundle in under 3.9 seconds.
- **API Latency**: Average endpoint response time $< 18.4\text{ ms}$ with Redis 7 response caching.

---

### 6. References
1. World Bank Group. (2024). *World Development Indicators API v2*.
2. International Monetary Fund. (2024). *International Financial Statistics (IFS) Database*.
3. Leaflet.js & CARTO. (2024). *Dark Matter Vector Tile Services*.
4. FastAPI & Pydantic. (2024). *High-Performance Asynchronous Python Web Framework*.
