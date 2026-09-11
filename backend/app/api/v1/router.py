from fastapi import APIRouter
from app.api.v1.endpoints import (
    health, auth, users, countries, indicators, 
    etl, risk, map, compare, news, ai, forecast,
    watchlists, alerts, reports, bookmarks, admin
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health Check"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users & RBAC"])
api_router.include_router(countries.router, prefix="/countries", tags=["Countries"])
api_router.include_router(indicators.router, prefix="/indicators", tags=["Indicators"])
api_router.include_router(etl.router, prefix="/etl", tags=["ETL Pipeline"])
api_router.include_router(risk.router, prefix="/risk", tags=["GeoRisk Engine & Analytics"])
api_router.include_router(map.router, prefix="/map", tags=["Interactive GIS Map"])
api_router.include_router(compare.router, prefix="/compare", tags=["Multi-Country Comparison"])
api_router.include_router(news.router, prefix="/news", tags=["Geopolitical News Intelligence"])
api_router.include_router(ai.router, prefix="/ai", tags=["GeoRisk RAG AI Assistant"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["Time-Series Forecasting & Scenario Simulation"])
api_router.include_router(watchlists.router, prefix="/watchlists", tags=["Watchlists"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Risk Alerts"])
api_router.include_router(reports.router, prefix="/reports", tags=["Executive Reports"])
api_router.include_router(bookmarks.router, prefix="/bookmarks", tags=["Bookmarks"])
api_router.include_router(admin.router, prefix="/admin", tags=["Enterprise Admin Operations"])
