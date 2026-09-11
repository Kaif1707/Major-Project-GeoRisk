# Lesson 3: Backend Architecture & FastAPI Service Layer

Welcome to **Lesson 3** of your senior engineering mentorship series on **GeoRisk Analytics**! In this lesson, we will explore the **Backend Architecture**, examining how Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM, PostgreSQL 16, and Redis 7 operate as a high-performance, asynchronous REST microservice.

---

## 1. Goal of the Backend Module

### Purpose
The primary objective of the backend architecture is to provide a secure, high-throughput, and modular API service capable of executing complex quantitative algorithms, managing database transactions, parsing external feeds, and delivering structured JSON data to the frontend in under 20 milliseconds.

### Business & Technical Problems Solved
- **Asynchronous Throughput**: Traditional Python WSGI web frameworks (like Django or Flask) handle requests synchronously, blocking worker threads during slow I/O operations (database reads, external World Bank API calls). FastAPI leverages Python's native `async/await` event loop to process thousands of concurrent requests.
- **Strict Data Validation**: Prevents invalid or malformed data payloads from reaching the database layer by enforcing strict, type-checked Pydantic models at the API boundary.
- **Self-Documenting API**: Automatically generates interactive OpenAPI (Swagger) documentation (`/docs`), allowing frontend developers and auditors to test endpoints directly.

---

## 2. Architecture

The backend follows an enterprise **Layered Architecture** strictly separating API routing, business logic services, data models, and database access.

### Backend Layered Architecture Diagram

```mermaid
graph TD
    ClientReq["Client HTTP Request (/api/v1/...)"]

    subgraph EntryLayer ["1. Web Server & Middleware Layer"]
        Uvicorn["Uvicorn ASGI Web Server"]
        FastAPIApp["app/main.py (FastAPI App)"]
        CORSMiddleware["CORS & Security Middleware"]
    end

    subgraph RouterLayer ["2. API Router Layer (app/api/v1/)"]
        CentralRouter["api/v1/router.py"]
        RiskRouter["endpoints/risk.py"]
        CountryRouter["endpoints/countries.py"]
        AuthRouter["endpoints/auth.py"]
    end

    subgraph DependencyLayer ["3. Dependency & Security Layer"]
        AuthDep["app/api/v1/endpoints/auth.py (JWT Bearer Guard)"]
        DBSessionDep["app/database/session.py (get_db Session Injector)"]
    end

    subgraph ServiceLayer ["4. Business Logic Services Layer (app/services/)"]
        RiskService["RiskService"]
        CountryService["CountryService"]
        ETLPipeline["ETLPipeline"]
        AIService["AIService"]
    end

    subgraph DataAccessLayer ["5. Data & Persistence Layer"]
        PydanticSchemas["app/schemas/ (Data Validation)"]
        SQLAlchemyORM["app/models/ (SQLAlchemy 2.0 ORM)"]
        PostgresDB[(PostgreSQL 16 Database)]
        RedisCache[(Redis 7 Cache)]
    end

    ClientReq --> Uvicorn
    Uvicorn --> FastAPIApp
    FastAPIApp --> CORSMiddleware
    CORSMiddleware --> CentralRouter
    CentralRouter --> RiskRouter
    RiskRouter --> AuthDep
    RiskRouter --> DBSessionDep
    AuthDep --> ServiceLayer
    DBSessionDep --> ServiceLayer
    ServiceLayer --> PydanticSchemas
    ServiceLayer --> SQLAlchemyORM
    SQLAlchemyORM --> PostgresDB
    ServiceLayer --> RedisCache
```

### Core Layers
1. **Config & Environment (`app/core/config.py`)**: Uses Pydantic `BaseSettings` to parse and validate OS environment variables.
2. **Database Engine (`app/database/session.py`)**: Manages SQLAlchemy 2.0 connection pools, transaction sessions, and SQLite development fallbacks.
3. **ORM Models (`app/models/`)**: Declarative Python classes mapping directly to PostgreSQL relational tables.
4. **Pydantic Schemas (`app/schemas/`)**: Request validation models and response serialization DTOs.
5. **Business Services (`app/services/`)**: Encapsulated business logic isolated from HTTP routing.
6. **API Routers (`app/api/v1/endpoints/`)**: FastAPI path operation functions handling request routes, parameters, and status codes.

---

## 3. Code Walkthrough

Let's examine the essential files constituting the backend core.

### 1. `backend/app/core/config.py`
- **Purpose**: Application configuration registry parsing environment variables with default fallbacks.
- **Code Walkthrough**:
  ```python
  from pydantic_settings import BaseSettings

  class Settings(BaseSettings):
      PROJECT_NAME: str = "GeoRisk Analytics"
      API_V1_STR: str = "/api/v1"
      SECRET_KEY: str = "georisk_secret_key_change_in_production"
      ALGORITHM: str = "HS256"
      ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
      DATABASE_URL: str = "postgresql://georisk:georisk_secret@localhost:5432/georisk_db"
      REDIS_URL: str = "redis://localhost:6379/0"
      CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

      class Config:
          env_file = ".env"

  settings = Settings()
  ```

### 2. `backend/app/database/session.py`
- **Purpose**: Establishes database engine connections and yields transaction sessions to API endpoints via FastAPI dependency injection.
- **Code Walkthrough**:
  ```python
  from sqlalchemy import create_engine
  from sqlalchemy.orm import sessionmaker, DeclarativeBase
  from app.core.config import settings

  # Connection pool configuration
  engine = create_engine(settings.DATABASE_URL, pool_size=20, max_overflow=10)
  SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

  class Base(DeclarativeBase):
      pass

  def get_db():
      db = SessionLocal()
      try:
          yield db
      finally:
          db.close()
  ```

### 3. `backend/app/schemas/response.py`
- **Purpose**: Standardized API response wrapper ensuring consistent JSON structures across all 48 endpoints.
- **Code Walkthrough**:
  ```python
  from typing import Generic, TypeVar, Optional
  from pydantic import BaseModel

  T = TypeVar("T")

  class StandardResponse(BaseModel, Generic[T]):
      status: str = "success"  # "success" or "error"
      message: str
      data: Optional[T] = None
  ```

### 4. `backend/app/api/v1/router.py`
- **Purpose**: Aggregates all 12 individual API endpoint routers into a unified router mounted at `/api/v1`.
- **Code Walkthrough**:
  ```python
  from fastapi import APIRouter
  from app.api.v1.endpoints import (
      health, auth, users, countries, indicators,
      etl, risk, map, compare, news, ai, forecast,
      watchlists, alerts, reports, bookmarks, admin
  )

  api_router = APIRouter()
  api_router.include_router(health.router, tags=["Health Check"])
  api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
  api_router.include_router(risk.router, prefix="/risk", tags=["GeoRisk Engine"])
  # ... mounts all routers
  ```

### 5. `backend/app/main.py`
- **Purpose**: Main ASGI entry point launching the FastAPI application.

---

## 4. Execution Flow

Here is the exact step-by-step execution path when an HTTP GET request hits `/api/v1/risk/USA`:

```text
1. Uvicorn Worker Receives Connection:
   Client dispatches `GET /api/v1/risk/USA` -> Uvicorn ASGI server receives TCP socket.

2. FastAPI Middleware & Routing:
   CORSMiddleware validates Request Origin -> Router matches path `/api/v1/risk/{country_id_or_code}`.

3. Dependency Injection:
   FastAPI executes `get_db()` dependency -> Opens DB session from pool (`SessionLocal`).

4. Service Layer Execution:
   Endpoint calls `RiskService.get_country_risk_score(db, "USA", year=2024)`.
   RiskService queries PostgreSQL ORM -> `db.query(RiskScore).join(Country)...`

5. Pydantic Serialization:
   RiskScore ORM object returned -> Service wraps object in `RiskScoreResponse.model_validate(score)`.
   Wrapped in `StandardResponse(status="success", message="...", data=score_dto)`.

6. HTTP Response Dispatch:
   FastAPI serializes Pydantic DTO to JSON -> Transmits HTTP 200 OK -> Session closed via `yield` cleanup.
```

---

## 5. Design Decisions

### Why FastAPI over Django or Flask?
- **Flask**: Micro-framework lacking built-in data validation, type checking, or async support. Requires assembling 10+ third-party plugins.
- **Django**: Heavy monolithic framework with a coupled ORM and server-side template engine. Unnecessary overhead for serving JSON APIs to a decoupled React SPA.
- **FastAPI**: Modern, lightweight, built on Python type hints, automatic Swagger documentation, and high-performance asynchronous execution.

### Why Pydantic v2 over Marshmallow?
- Pydantic v2 has its core validation engine implemented in Rust. It is up to **20x faster** than Marshmallow or Pydantic v1, provides native Python type-hint integration, and automatically generates JSON schemas.

### Why SQLAlchemy 2.0 ORM over Raw SQL?
- SQLAlchemy 2.0 introduces explicit type annotations (`Mapped[str]`), supports async sessions, prevents SQL injection through query parametrization, and allows seamlessly switching between PostgreSQL 16 (production) and SQLite (testing).

---

## 6. Possible Faculty Questions & Model Answers

### Q1: What is FastAPI and what web server gateway interface does it use?
> **Model Answer**: FastAPI is a modern Python web framework for building APIs. It uses an **ASGI** (Asynchronous Server Gateway Interface) server called **Uvicorn**, enabling non-blocking asynchronous request handling.

### Q2: What is Pydantic and how is it used in your project?
> **Model Answer**: Pydantic is a data validation library. In our backend, Pydantic v2 schemas validate incoming request payloads and serialize outgoing response models.

### Q3: What is Dependency Injection in FastAPI?
> **Model Answer**: Dependency Injection allows endpoints to declare dependencies (like database sessions `get_db` or authenticated users `get_current_user`). FastAPI automatically evaluates and injects these dependencies before executing the endpoint code.

### Q4: How do you handle database sessions cleanly to prevent connection leaks?
> **Model Answer**: We use a generator function `get_db()` with a `try...finally` block. FastAPI injects the session into the request and guarantees the session is closed in `finally` after response delivery.

### Q5: What is the purpose of `alembic` in Python projects?
> **Model Answer**: Alembic is a database migration tool for SQLAlchemy. It tracks database schema changes over time as versioned Python migration scripts (`0001` to `0005`).

### Q6: How do you handle cross-origin requests from the frontend?
> **Model Answer**: We configure FastAPI’s `CORSMiddleware` in `main.py`, specifying allowed frontend origins (`CORS_ORIGINS`), allowed headers, and allowed HTTP methods.

### Q7: What is the difference between `Query(...)` and `Path(...)` in FastAPI?
> **Model Answer**: `Path(...)` declares parameters embedded inside the URL path (e.g. `/risk/{country_code}`), while `Query(...)` declares URL query parameters (e.g. `/risk?year=2024&region=Asia`).

### Q8: What is a DTO (Data Transfer Object)?
> **Model Answer**: A DTO is an object used to transfer data between software layers. In our application, Pydantic schemas act as DTOs to decouple database ORM models from client-facing JSON APIs.

### Q9: How do you prevent sensitive fields (like password hashes) from being returned in API responses?
> **Model Answer**: We exclude sensitive database columns from client-facing Pydantic response models (e.g., `UserResponse` excludes `password_hash`).

### Q10: How is database connection pooling configured?
> **Model Answer**: SQLAlchemy's `create_engine` configures connection pool properties `pool_size=20` (maintaining 20 persistent connections) and `max_overflow=10` (allowing up to 10 temporary extra connections under peak load).

---

## 7. Possible Software Engineering Interview Questions & Answers

### Q1: Explain the difference between ASGI and WSGI Python servers.
> **Detailed Answer**: WSGI (Web Server Gateway Interface) is a synchronous standard handling one request per thread. If a request waits on database I/O, the thread blocks. ASGI (Asynchronous Server Gateway Interface) supports `async/await` event loops, handling thousands of concurrent I/O-bound requests on a single event loop without thread blocking.

### Q2: What is the N+1 query problem in ORMs and how do you prevent it in SQLAlchemy?
> **Detailed Answer**: The N+1 query problem occurs when fetching a parent record requires 1 query, and accessing its $N$ child relationships executes $N$ additional database queries. In SQLAlchemy, this is prevented using eager loading strategies like `.joinedload()` or `.subqueryload()`.

### Q3: What is Database Connection Pooling and why is it necessary?
> **Detailed Answer**: Opening and closing TCP connections to a database server for every HTTP request is expensive. Connection pooling maintains a pool of open database connections, allowing API requests to reuse existing connections instantly.

### Q4: How does FastAPI generate OpenAPI documentation automatically?
> **Detailed Answer**: FastAPI inspects Python type hints, path parameters, and Pydantic models attached to path operation functions, automatically compiling them into a standardized OpenAPI 3.0 JSON specification rendered via Swagger UI at `/docs`.

### Q5: What is the difference between soft deletion and hard deletion in database design?
> **Detailed Answer**: Hard deletion permanently executes `DELETE FROM table`, removing data. Soft deletion updates a `deleted_at` timestamp column to a non-null value, preserving historical records for auditing while excluding them from active queries.

### Q6: How do you implement global error handling in FastAPI?
> **Detailed Answer**: FastAPI provides `@app.exception_handler(HTTPException)`, allowing developers to register custom exception handlers that intercept errors globally and format them into consistent JSON responses.

### Q7: What is the purpose of Python `TypeVar` and `Generic` in Pydantic models?
> **Detailed Answer**: `TypeVar` and `Generic` enable building generic data wrappers (like `StandardResponse[T]`), allowing type checkers and IDEs to understand the exact payload type nested inside the data field.

### Q8: How does Python's `yield` keyword work in FastAPI dependencies?
> **Detailed Answer**: `yield` splits dependency execution into two phases. Code before `yield` runs *before* the API endpoint executes (opening the DB session). Code after `yield` runs *after* the endpoint completes (closing the session).

### Q9: Why is database migration version control essential in production systems?
> **Detailed Answer**: Schema migrations allow database structures to evolve alongside code changes incrementally without data loss. They can be tested in staging and automatically applied in production pipelines (`alembic upgrade head`).

### Q10: How do you handle floating-point precision issues in financial or risk analytics APIs?
> **Detailed Answer**: Floating-point numbers are rounded explicitly at the service layer using `round(val, 2)` or represented using Python's `decimal.Decimal` type to prevent binary floating-point representation drift.

---

## 8. Common Mistakes to Avoid

1. **Creating DB Sessions Per Function Call**: Instantiating `SessionLocal()` directly inside helper functions leads to unclosed connections. **Avoided** by using FastAPI dependency injection (`db: Session = Depends(get_db)`).
2. **Exposing Raw ORM Objects in Endpoint Returns**: Returning SQLAlchemy ORM objects directly bypasses output validation. **Avoided** by serializing ORM objects into Pydantic response models (`UserResponse.model_validate(user)`).
3. **Forgetting Database Indexes on Foreign Keys**: Queries performing joins across unindexed foreign keys cause full table scans. **Avoided** by explicitly setting `index=True` on all foreign key columns.
4. **Synchronous DB Drivers in Async Endpoints**: Using blocking synchronous ORM calls inside `async def` endpoints blocks the event loop. **Avoided** by structuring service calls properly.

---

## 9. Revision Notes for Viva (2-Minute Review)

- **Backend Framework**: Python 3.11+ FastAPI (ASGI) running on Uvicorn server.
- **ORM & Migrations**: SQLAlchemy 2.0 (Declarative Base) + Alembic (`0001` to `0005` migrations).
- **Validation**: Pydantic v2 schemas for request bodies and response DTO serialization.
- **Database Engine**: PostgreSQL 16 with connection pooling (`pool_size=20`, `max_overflow=10`).
- **Response Wrapper**: `StandardResponse[T]` providing unified `{ status, message, data }` JSON structure.
- **Security**: JWT Bearer token authentication + fine-grained RBAC permission guards.

---

## 10. Mini Quiz

Test your understanding of Lesson 3 by answering these 5 questions:

1. **What is an ASGI server, and what specific server executes our FastAPI application?**
2. **What function acts as the database session dependency injector in `app/database/session.py`?**
3. **What generic class defines the standardized JSON envelope returned across all API endpoints?**
4. **Why is Pydantic v2 significantly faster than previous data validation libraries?**
5. **How does Alembic track migration history, and what command applies all pending migrations?**
