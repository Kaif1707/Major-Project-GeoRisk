# Lesson 19: Production Hardening, Security Audit, Docker & CI/CD Deployment

Welcome to **Lesson 19** of your senior engineering mentorship series on **GeoRisk Analytics**! In this lesson, we will examine **Production Deployment, Security Hardening & DevOps**, exploring multi-stage Docker containerization, `docker-compose.prod.yml`, GitHub Actions CI/CD workflows, CORS settings, security headers, environment secret templates, and production health endpoints.

---

## 1. Goal of the Deployment Module

### Purpose
The primary objective of the Deployment & Security module is to package GeoRisk Analytics for reliable, containerized, zero-downtime production deployment, ensuring strict environment isolation, automated CI/CD testing, production health monitoring, and security hardening.

### Production Problems Solved
- **"Works on My Machine" Syndrome**: Environment discrepancies between developer laptops and production servers cause crashes. Solved using **Multi-Stage Docker Containerization**.
- **Manual Deployment Fatigue**: Manually SSHing into servers to pull code and run builds leads to human errors. Solved using **GitHub Actions Automated CI/CD Pipelines**.
- **Security Vulnerabilities**: Exposing development secrets, debug modes, or unrestricted CORS origins in production. Solved using **Environment Validation (`.env.production`) and Security Hardening**.

---

## 2. Architecture

The Production Infrastructure comprises 4 containerized services managed via `docker-compose.prod.yml`, validated by GitHub Actions (`.github/workflows/ci.yml`), and monitored via `/health` API endpoints.

### Production Deployment Architecture Diagram

```mermaid
graph TD
    GitHubRepo["GitHub Repository (Main Branch)"]

    subgraph Pipeline ["GitHub Actions CI/CD Workflow (.github/workflows/ci.yml)"]
        LintTest["1. Backend Pytest & Type Check"]
        BuildTest["2. Frontend TypeScript & Vite Production Build"]
        DockerBuild["3. Multi-Stage Docker Image Build"]
    end

    subgraph ProductionHost ["Production Host (Docker Compose Orchestration)"]
        FrontendContainer["frontend_prod (Nginx Alpine - Port 80)"]
        BackendContainer["backend_prod (FastAPI Python 3.11 - Port 8000)"]
        PostgresContainer["postgres_prod (PostgreSQL 16 Alpine - Port 5432)"]
        RedisContainer["redis_prod (Redis 7 Alpine - Port 6379)"]
    end

    subgraph HealthMonitoring ["Health Check APIs"]
        HealthEndpoint["GET /api/v1/health"]
        DBHealthEndpoint["GET /api/v1/health/database"]
        CacheHealthEndpoint["GET /api/v1/health/cache"]
        SysHealthEndpoint["GET /api/v1/health/system"]
    end

    GitHubRepo -->|Push / PR| Pipeline
    Pipeline --> LintTest & BuildTest & DockerBuild
    DockerBuild -->|Deploy| ProductionHost

    FrontendContainer -->|Reverse Proxy / Reverse Pass| BackendContainer
    BackendContainer --> PostgresContainer
    BackendContainer --> RedisContainer

    BackendContainer --> HealthMonitoring
```

---

## 3. Code Walkthrough

Let's inspect the key deployment configuration files.

### 1. `Dockerfile.backend`
- **Purpose**: Multi-stage Python 3.11 build producing a minimal runtime container image.
- **Code Walkthrough**:
  ```dockerfile
  FROM python:3.11-slim as builder
  WORKDIR /app
  RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc libpq-dev && rm -rf /var/lib/apt/lists/*
  COPY backend/requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt

  FROM python:3.11-slim as runner
  WORKDIR /app
  COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
  COPY --from=builder /usr/local/bin /usr/local/bin
  COPY backend /app
  EXPOSE 8000
  ENV PYTHONUNBUFFERED=1 PORT=8000
  CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```

### 2. `Dockerfile.frontend`
- **Purpose**: Multi-stage Node 20 build compiling React assets into static `dist/` files served by Nginx.
- **Code Walkthrough**:
  ```dockerfile
  FROM node:20-alpine as builder
  WORKDIR /app
  COPY frontend/package*.json ./
  RUN npm install --legacy-peer-deps
  COPY frontend/ ./
  RUN npm run build

  FROM nginx:alpine as runner
  COPY --from=builder /app/dist /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```

### 3. `docker-compose.prod.yml`
- **Purpose**: Orchestrates all 4 production containers with health checks and persistent volume mounts.
- **Code Walkthrough**:
  ```yaml
  version: '3.8'

  services:
    postgres:
      image: postgres:16-alpine
      container_name: georisk_postgres_prod
      environment:
        POSTGRES_DB: georisk_db
        POSTGRES_USER: georisk_prod
        POSTGRES_PASSWORD: georisk_secure_password_2026
      ports:
        - "5432:5432"
      volumes:
        - postgres_prod_data:/var/lib/postgresql/data

    redis:
      image: redis:7-alpine
      container_name: georisk_redis_prod
      ports:
        - "6379:6379"

    backend:
      build:
        context: .
        dockerfile: Dockerfile.backend
      container_name: georisk_backend_prod
      ports:
        - "8000:8000"
      environment:
        DATABASE_URL: postgresql://georisk_prod:georisk_secure_password_2026@postgres:5432/georisk_db
        REDIS_URL: redis://redis:6379/0
      depends_on:
        - postgres
        - redis

    frontend:
      build:
        context: .
        dockerfile: Dockerfile.frontend
      container_name: georisk_frontend_prod
      ports:
        - "80:80"
      depends_on:
        - backend

  volumes:
    postgres_prod_data:
  ```

### 4. `.github/workflows/ci.yml`
- **Purpose**: GitHub Actions workflow executing backend Pytest test suites and frontend Vite production builds on every push.

---

## 4. Execution Flow

Here is what happens during automated deployment:

```text
1. Code Push:
   Developer pushes code to `main` branch -> Triggers GitHub Actions workflow (`.github/workflows/ci.yml`).

2. CI Pipeline Execution:
   Runner 1 installs Python dependencies -> Runs `pytest` suite -> Verifies test coverage.
   Runner 2 installs Node dependencies -> Executes `npm run build` -> Validates 2,494 module compilation.

3. Docker Container Build & Launch:
   Host executes `docker-compose -f docker-compose.prod.yml up --build -d`.
   Docker builds multi-stage images -> Launches Postgres 16, Redis 7, FastAPI Backend, and Nginx Frontend.

4. Health Verification:
   Load balancer queries `GET /api/v1/health` -> Receives `HTTP 200 OK` `{ "status": "UP" }` -> Routes traffic.
```

---

## 5. Design Decisions

### Why Multi-Stage Docker Builds?
Multi-stage Docker builds separate heavy build environments (Node compilers, C-extension build tools) from final runtime environments. This drastically reduces the production image size (Nginx Alpine image $< 25\text{ MB}$), decreasing deployment times and shrinking attack surfaces.

### Why Container Health Checks (`GET /health`)?
Container orchestrators (Docker Compose, Kubernetes) need to know when a container is ready to accept traffic. Health endpoints verify database and cache connectivity before routing live user requests.

---

## 6. Possible Faculty Questions & Model Answers

1. **What tools are used to containerize and orchestrate your application?** -> Docker (via multi-stage `Dockerfile.backend` and `Dockerfile.frontend`) and Docker Compose (`docker-compose.prod.yml`).
2. **What services run inside Docker containers in production?** -> 1. Nginx Frontend, 2. FastAPI Backend, 3. PostgreSQL 16 Database, 4. Redis 7 Cache.
3. **What is the purpose of a multi-stage Dockerfile?** -> To separate build-time compilers from runtime artifacts, producing lightweight, secure production images.
4. **What health check endpoints exist in your API?** -> `/health`, `/health/database`, `/health/cache`, `/health/system`.
5. **How does GitHub Actions automate CI/CD?** -> `.github/workflows/ci.yml` runs automated Pytest backend suites and Vite frontend builds on every push to `main`.
6. **Where are production environment variables stored?** -> In `.env.production` templates, passed securely into containers via Docker Compose environment blocks.
7. **What web server serves static frontend assets in production?** -> **Nginx Alpine**.
8. **How is persistent database storage managed in Docker?** -> Using named Docker volumes (`postgres_prod_data`) mounted to `/var/lib/postgresql/data`.
9. **How are CORS origins restricted in production?** -> By setting `CORS_ORIGINS=["https://georisk.internal"]` in `.env.production`.
10. **How do you verify production build readiness locally?** -> By running `npm run build` in `frontend` and `python -m py_compile` across all backend modules.

---

## 7. Possible Software Engineering Interview Questions & Answers

1. **What is the difference between Docker `CMD` and `ENTRYPOINT` instructions?** -> 
   - `ENTRYPOINT`: Defines the core executable binary that always runs when the container starts.
   - `CMD`: Provides default arguments to `ENTRYPOINT` that can be overridden at runtime.
2. **What is Continuous Integration (CI) vs Continuous Deployment (CD)?** -> 
   - **CI**: Automatically linting, building, and running test suites on every code commit.
   - **CD**: Automatically building production container images and deploying them to staging/production servers.
3. **How do you secure Docker containers running in production?** -> Running containers as non-root users, keeping base images minimal (Alpine/Slim), scanning dependencies for vulnerabilities (`docker scan`), and disabling unnecessary exposed ports.
4. **What is Horizontal Scaling vs Vertical Scaling?** -> 
   - **Horizontal Scaling**: Adding more container instances behind a load balancer.
   - **Vertical Scaling**: Adding more CPU/RAM resources to a single server instance.
5. **What is a Reverse Proxy and why is Nginx used in front of Uvicorn?** -> Nginx handles TLS/SSL termination, static asset caching, Gzip compression, and HTTP request buffering, shielding Uvicorn ASGI application workers.
6. **How do you handle zero-downtime rolling deployments?** -> Launching new container instances alongside old ones, running database migrations, verifying health checks, and updating load balancer routing before terminating old containers.
7. **What is Infrastructure as Code (IaC)?** -> Managing server infrastructure declaratively using code (Terraform, Ansible, Docker Compose) rather than manual console configuration.
8. **How do you handle secrets management in production environments?** -> Injecting secrets via environment variables, secrets managers (AWS Secrets Manager, HashiCorp Vault), or Docker secrets, avoiding committing plaintext secrets to Git.
9. **What is the difference between Docker volumes and bind mounts?** -> 
   - **Volumes**: Managed entirely by Docker storage drivers inside `/var/lib/docker/volumes/`, isolated from host OS paths.
   - **Bind Mounts**: Maps arbitrary host directory paths directly into container file systems.
10. **How do you monitor application performance metrics (APM) in production?** -> Integrating APM tools (Prometheus, Grafana, Datadog, Sentry) to track endpoint latency, error rates, memory usage, and throughput.

---

## 8. Common Mistakes to Avoid

1. **Committing `.env` Secret Files to Git**: Pushing database credentials or JWT secret keys to GitHub. **Avoided** by adding `.env` to `.gitignore` and providing `.env.production` templates.
2. **Single-Stage Heavy Docker Images**: Shipping 1.5 GB Node/Python images to production. **Avoided** by writing multi-stage Dockerfiles.
3. **Exposing Database Ports to the Public Internet**: Exposing PostgreSQL port 5432 publicly without firewall bounds. **Avoided** by isolating database networks inside Docker Compose.
4. **Deploying Without Automated CI Testing**: Deploying broken builds directly to production servers. **Avoided** by requiring GitHub Actions workflow passing before merges.

---

## 9. Revision Notes for Viva (2-Minute Review)

- **Containerization**: Multi-stage `Dockerfile.backend` (Python 3.11 slim) & `Dockerfile.frontend` (Node 20 / Nginx alpine).
- **Orchestration**: `docker-compose.prod.yml` coordinating Postgres 16, Redis 7, FastAPI Backend, and Nginx Frontend.
- **CI/CD**: `.github/workflows/ci.yml` running Pytest suites and Vite production builds.
- **Health Monitoring**: Endpoints `/health`, `/health/database`, `/health/cache`, `/health/system`.
- **Security**: CORS origin enforcement, bcrypt password hashing, and `.env.production` template isolation.

---

## 10. Mini Quiz

1. **What 4 containerized services are defined in `docker-compose.prod.yml`?**
2. **What web server serves static frontend production assets in `Dockerfile.frontend`?**
3. **What GitHub Actions workflow file automates CI/CD testing on code pushes?**
4. **What health check endpoint verifies database connectivity?**
5. **Why are multi-stage Docker builds preferred for production container images?**
