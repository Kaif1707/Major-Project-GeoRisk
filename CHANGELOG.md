# GeoRisk Analytics — Master Release Changelog

All notable changes across all 10 implementation phases of the GeoRisk Analytics platform are documented below.

---

## [1.0.0] - 2026-07-25 - Production Release

### Phase 1: Project Foundation & Architecture Setup
- Built monorepo structure with React 19 + TypeScript + Vite frontend and FastAPI backend.
- Designed slate dark theme design system (`#0B0F17`), Lucide icon integration, and 13-module routing shell.
- Built Landing Page and Dashboard Shell.

### Phase 2: Authentication, Database Foundation & RBAC
- Created PostgreSQL ORM models with UUID primary keys (`User`, `Role`, `Permission`, `RefreshToken`, `AuditLog`).
- Generated initial Alembic migration `0001_initial_auth_rbac_tables`.
- Built JWT Auth engine with bcrypt password hashing and token rotation.
- Created Auth UI pages (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `SettingsPage`).

### Phase 3: Data Engineering & ETL Pipeline
- Created ORM models for `Country`, `Region`, `EconomicIndicator`, `PoliticalIndicator`, `SocialIndicator`, `BusinessIndicator`.
- Generated Alembic migration `0002_create_etl_country_indicator_tables` and seeded 195 sovereign nations with 4 years of historical indicators (2021–2024).
- Built modular ETL Pipeline (`worldbank.py`, `imf.py`, `validation.py`, `cleaner.py`, `transformer.py`, `loader.py`).

### Phase 4: GeoRisk Scoring Engine & Analytics Core
- Created ORM models for `RiskCategory`, `RiskWeight`, `ScoreVersion`, `RiskScore`, `RiskFactor`, `RiskHistory`, `ScoreCalculationLog`.
- Built `ScoreNormalizer` (MinMax scaling & metric inversion engine), `RankingEngine` (global and regional country ranks), and `GeoRiskEngine` (8 dimension sub-scores: Economic, Political, Business, Social, Conflict, Trade, Currency, External Relations).
- Built REST API router `/api/v1/risk`.

### Phase 5: Enterprise Dashboard & Analytics Interface
- Installed `recharts` and connected React 19 SPA directly to backend REST endpoints via TanStack Query.
- Built `RiskDistributionChart` (Donut), `TopCountriesChart` (Bar), `RiskRadarChart` (8-dimension Radar), `CountryDataTable`, and `FactorBreakdownTable`.
- Built live `DashboardPage`, `CountriesPage`, and `CountryDetailPage`.

### Phase 6: World Map, Country Analytics & Comparison Module
- Installed `leaflet` and `react-leaflet` for GIS vector world map rendering.
- Built `InteractiveWorldMap.tsx` with CARTO Dark tiles, risk category choropleth markers, and hover tooltips.
- Built `CompareService` and Multi-Country Comparison Studio (`ComparePage.tsx`) supporting side-by-side benchmarking for 2 to 5 countries.

### Phase 7: AI Intelligence, News Analytics & Forecasting
- Created ORM models for `NewsArticle`, `NewsCategory`, `NewsSentiment`, `ForecastModel`, `ScenarioSimulationLog`.
- Built `NewsFetcher`, `SentimentAnalyzer` (NLP sentiment scoring & keyword extraction), and AI summarizer.
- Built `ForecastingEngine` (30d, 90d, 180d, 365d projections with 95% confidence corridor bands) and `ScenarioSimulator` (what-if macro stress testing).
- Built `GeoRiskAIAssistant` (`POST /api/v1/ai/chat`) providing grounded RAG analyst briefings.
- Built live `NewsPage`, `AIAssistantPage`, and `ForecastPage`.

### Phase 8: Reporting, Watchlists, Alerts & Enterprise Productivity
- Created ORM models for `Watchlist`, `WatchlistCountry`, `AlertRule`, `AlertNotification`, `GeneratedReport`, `Bookmark`.
- Built `WatchlistService`, `AlertService`, `ReportService` (PDF brief generator, CSV & JSON data exporters), and `BookmarkService`.
- Built live `WatchlistsPage`, `AlertsPage`, `ReportsPage`, and `SettingsPage`.

### Phase 9: Enterprise Admin Panel, System Management & Data Operations
- Built `AdminService` assembling system status metrics (total users, active sessions, DB connections, Redis cache health).
- Built `AdminPage.tsx` featuring 5 management modules (System Overview, User Administration, GeoRisk Weight Studio, ETL Data Operations, Audit Logs).

### Phase 10: Production Optimization, Testing, Security & Deployment
- Built production health check endpoints (`/health/database`, `/health/cache`, `/health/system`).
- Added automated pytest test suites (`test_risk_engine.py`, `test_etl.py`).
- Added multi-stage `Dockerfile.backend`, `Dockerfile.frontend`, `docker-compose.prod.yml`, and `.github/workflows/ci.yml`.
- Created production documentation suite (`README.md`, `DEPLOYMENT.md`, `API_DOCUMENTATION.md`, `ARCHITECTURE.md`, `CHANGELOG.md`).
