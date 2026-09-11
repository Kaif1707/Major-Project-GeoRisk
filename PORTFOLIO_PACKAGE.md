# GeoRisk Analytics — Portfolio Showcase & Resume Package

---

## 1. Project Summaries

### One-Line Summary
> **GeoRisk Analytics** is an enterprise-grade quantitative geopolitical and macroeconomic risk platform evaluating 195 sovereign nations using normalized 8-dimension risk vectors, interactive GIS maps, predictive time-series forecasting, and RAG conversational AI.

### Short Summary (3-4 Sentences)
GeoRisk Analytics aggregates fragmented macroeconomic, political stability, governance, social, and conflict indicators into a transparent 0.0–100.0 GeoRisk score across 195 sovereign nations. Featuring a high-performance React 19 SPA and a FastAPI Python backend, the platform equips institutional investors with an interactive Leaflet GIS heatmap, multi-country comparison studio, predictive time-series forecasting (30d–365d horizons with 95% confidence corridors), what-if scenario simulator, and RAG-grounded conversational AI analyst. Enterprise productivity features include custom watchlists, automated risk threshold alerts, PDF/CSV executive exports, and audit-logged RBAC administration.

### Long Summary (Full Description)
GeoRisk Analytics is an end-to-end SaaS intelligence platform designed to replace static credit ratings with dynamic, data-driven quantitative sovereign risk intelligence. The backend engine ingests data from international sources (World Bank, IMF, GDELT), validates metric boundaries, imputes missing values, and calculates an overall weighted GeoRisk score using MinMax feature normalization with metric inversion handling (e.g. GDP growth reduction vs inflation increase). 

Built with React 19, TypeScript, Vite, Tailwind CSS, Recharts, and Leaflet, the frontend delivers a high-density terminal dashboard. Users can explore global spatial heatmaps, benchmark 2 to 5 countries side-by-side, simulate what-if macro events (GDP shifts, inflation surges, political instability), ask risk questions to a RAG AI assistant (`POST /api/v1/ai/chat`), build watchlists, set up automated threshold notifications, and export executive PDF/CSV briefs. The platform includes full administrative management for users, roles, GeoRisk dimension weights, manual ETL triggers, and audit logs.

---

## 2. Technical Highlights & Architectural Excellence
- **8-Dimension Risk Vector**: Weighted index aggregating Economic (30%), Political (25%), Business (15%), Social (10%), Conflict (10%), Trade (5%), Currency (3%), and External Relations (2%).
- **Interactive GIS & Data Visualization**: Responsive Leaflet vector world map with choropleth category coloring (`Very Low` Green to `Extreme` Dark Red) and Recharts 8-dimension vector Radar charts.
- **Time-Series Forecasting & Stress Simulator**: Linear regression and Holt-Winters forecasting models predicting 30d–365d trajectories with 95% confidence bounds and interactive what-if event sliders.
- **RAG GeoRisk AI Assistant**: Natural language query interface powered by live database context retrieval.
- **Enterprise Productivity**: Custom watchlists, threshold alert rules, in-app notification center, CSV/JSON data exporters, executive PDF briefs, and audit-logged RBAC administration.

---

## 3. Resume Bullet Points (Tailored for Applications)

### Full-Stack Software Engineer
- Architectural lead for **GeoRisk Analytics**, an enterprise SaaS platform monitoring sovereign risk across **195 countries** using React 19, TypeScript, FastAPI, PostgreSQL, and Redis.
- Implemented JWT authentication with bcrypt password hashing, SHA-256 refresh token rotation, and fine-grained Role-Based Access Control (RBAC).
- Developed a high-density dark terminal UI with Recharts vector charts, Leaflet GIS spatial maps, and custom watchlists.

### Data / Machine Learning Engineer
- Designed an automated ETL data pipeline collecting, validating, and imputing 780 macroeconomic indicator series from World Bank and IMF REST APIs.
- Built a time-series forecasting engine (Linear Regression & Holt-Winters) projecting 30d–365d risk trajectories with 95% confidence corridor bands.
- Built a RAG AI Assistant engine (`POST /api/v1/ai/chat`) retrieving live database facts to generate grounded institutional investment briefings.

### Business Intelligence & Analytics Engineer
- Formulated a 0.0–100.0 quantitative GeoRisk scoring model with MinMax scaling and metric inversion for inverted safety metrics (GDP growth vs inflation).
- Designed a Multi-Country Comparison Studio benchmarking 2 to 5 nations side-by-side with automated analytical takeaway banners.
- Created an executive report generator formatting risk dossiers with instant PDF, CSV, and JSON data export capabilities.

---

## 4. Key Learning Outcomes & Competencies
- **Quantitative Modeling**: MinMax normalization, metric inversion, and multi-criteria decision analysis (MCDA).
- **Asynchronous Python Systems**: FastAPI, Pydantic v2 validation, SQLAlchemy 2.0 ORM, Alembic migrations, and PostgreSQL pool optimization.
- **Modern Frontend Architecture**: React 19, TypeScript, Vite, TanStack Query v5 caching, Tailwind CSS design system, and Leaflet vector GIS rendering.
- **Production Operations**: Docker multi-stage containerization, GitHub Actions CI/CD workflows, Redis response caching, and structured audit logging.
