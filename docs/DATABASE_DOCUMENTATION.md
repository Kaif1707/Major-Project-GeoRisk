# GeoRisk Analytics — Database Schema & Data Dictionary

Database Engine: PostgreSQL 16 (Development fallback: SQLite 3)  
Migration Framework: Alembic

---

## Database Tables Summary (17 Relational Tables)

1. **`users`**: User identities, credentials, active status, role assignment (`id`, `email`, `username`, `full_name`, `password_hash`, `role_id`, `is_active`).
2. **`roles`**: System roles (`id`, `name`, `code`, `description`, `is_system`).
3. **`permissions`**: Granular system permissions (`id`, `name`, `code`, `module`).
4. **`role_permissions`**: Role-to-permission mapping (`id`, `role_id`, `permission_id`).
5. **`refresh_tokens`**: Revocable SHA-256 hashed refresh tokens (`id`, `user_id`, `token_hash`, `expires_at`, `is_revoked`).
6. **`audit_logs`**: System audit trail (`id`, `user_id`, `action`, `module`, `status`, `ip_address`, `timestamp`).
7. **`user_sessions`**: Active login sessions (`id`, `user_id`, `session_token`, `ip_address`, `is_active`).
8. **`countries`**: Sovereign nation records (`id`, `name`, `iso_code`, `iso_alpha2`, `region`, `continent`, `capital`, `flag_url`).
9. **`regions`**: Global geographic regions (`id`, `name`, `code`, `description`).
10. **`indicator_sources`**: External API provider metadata (`id`, `name`, `code`, `base_url`).
11. **`economic_indicators`**: Macroeconomic indicators (`id`, `country_id`, `year`, `gdp_usd`, `gdp_growth_pct`, `inflation_pct`, `unemployment_pct`).
12. **`political_indicators`**: Governance indicators (`id`, `country_id`, `year`, `political_stability`, `govt_effectiveness`).
13. **`risk_categories`**: GeoRisk category thresholds (`id`, `name`, `min_score`, `max_score`, `color_code`).
14. **`risk_weights`**: Dimension weight profiles (`id`, `dimension_name`, `metric_code`, `weight_pct`, `is_inverted`, `is_active`).
15. **`risk_scores`**: Calculated GeoRisk scores (`id`, `country_id`, `year`, `overall_score`, `economic_score`, `political_score`, `global_rank`).
16. **`news_articles`**: Aggregated geopolitical news (`id`, `title`, `country_id`, `category`, `sentiment_score`, `sentiment_label`, `ai_summary`).
17. **`forecast_models`**: Time-series forecast predictions (`id`, `country_id`, `forecast_horizon_days`, `predicted_value`, `lower_bound`, `upper_bound`).
