# GeoRisk Analytics — Technical Interview Preparation & Defense Guide

This guide prepares you to answer technical interview questions about the architecture, design choices, database schema, algorithms, and security of **GeoRisk Analytics**.

---

## 1. Architectural Decisions & Technical Trade-offs

### Q: Why FastAPI instead of Django or Flask?
> **Answer**: FastAPI was chosen for three primary reasons:
> 1. **Performance**: Built on Starlette and Pydantic, FastAPI leverages Python's native `async/await` syntax, delivering execution speeds on par with NodeJS and Go.
> 2. **Type Safety & Auto-Docs**: Pydantic v2 schemas provide strict runtime data validation and automatically generate interactive OpenAPI (Swagger) documentation.
> 3. **Lightweight Decoupling**: Unlike Django's monolithic ORM/admin stack, FastAPI provides a decoupled micro-framework ideal for serving decoupled React SPAs.

### Q: Why React 19 + TypeScript + Vite instead of Next.js?
> **Answer**: GeoRisk Analytics is an internal/institutional SaaS intelligence terminal requiring high client-side state manipulation, real-time map canvas rendering, and TanStack Query data caching. Since public search engine indexing (SEO) for authenticated analytics tools is unnecessary, a Vite-powered React 19 SPA avoids server-side rendering overhead while delivering instant HMR and faster client-side bundle execution.

### Q: Why PostgreSQL instead of MongoDB or DynamoDB?
> **Answer**: Sovereign risk analytical models require strict relational consistency across countries, multi-year economic indicator time-series, dimension weight versions, user permissions, and audit logs. PostgreSQL provides strong ACID guarantees, powerful indexing on foreign keys, flexible JSONB support for unstructured indicator metadata, and seamless SQLAlchemy 2.0 ORM integration.

---

## 2. Deep-Dive Model Interview Questions & Answers

### Q1: How does the metric inversion logic work in your scoring engine?
> **Answer**: Standard MinMax normalization maps high raw values to high scores ($100.0$). However, for safety-oriented indicators like real GDP growth or political stability, a higher value implies *lower* sovereign risk. The engine dynamically checks the `is_inverted` flag in `risk_weights`. If `is_inverted = True`, the normalized score is calculated as $(1.0 - \text{norm\_val}) \times 100.0$.

### Q2: How do you prevent SQL Injection and XSS attacks?
> **Answer**: SQL Injection is prevented by using SQLAlchemy 2.0 ORM parametrized queries across all endpoints, eliminating raw string concatenation. XSS is prevented on the frontend by React's automatic JSX text escaping, supplemented by Content Security Policy (CSP) headers and input validation via Pydantic schemas.

### Q3: How is authentication security and token rotation managed?
> **Answer**: Passlib bcrypt (`rounds=12`) hashes user passwords. Upon successful login, short-lived JWT Access Tokens (15–60 min expiry) signed with `HS256` are issued along with long-lived Refresh Tokens (30 days). Refresh Tokens are hashed with SHA-256 and saved in the `refresh_tokens` database table. When a token is refreshed, the old refresh token is revoked and replaced, preventing replay attacks.

### Q4: How does the What-If Scenario Simulator calculate instant score changes?
> **Answer**: The `ScenarioSimulator` applies differential weights to the country's baseline raw indicator vector. For instance, adjusting GDP growth delta by $+2.0\%$ computes a weighted economic score reduction of $-(2.0 \times 1.5) = -3.0$ points. The engine recalculates all 8 dimension sub-scores, re-aggregates the overall index, and maps the resulting score to new risk categories in real time.

### Q5: How do you optimize database query performance for large datasets?
> **Answer**: 
> 1. Indexing: Created Composite B-Tree indexes on `(country_id, year)`, `(iso_code)`, `(user_id)`, and `(published_at)`.
> 2. Connection Pooling: Maintained SQLAlchemy connection pool (`pool_size=20`, `max_overflow=10`).
> 3. Response Caching: Integrated Redis 7 to cache global rankings and country feature lists with automated TTL invalidation.
