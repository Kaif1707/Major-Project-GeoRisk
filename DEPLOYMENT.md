# GeoRisk Analytics — Production Deployment Guide

This guide details instructions for deploying **GeoRisk Analytics** to production environments.

---

## 1. Docker Compose Production Deployment

### Prerequisites
- Host machine running Linux (Ubuntu 22.04 LTS recommended)
- Docker 24.0+ and Docker Compose 2.20+
- Domain name pointed to host IP address

### Step-by-Step Instructions

1. **Clone Repository**:
   ```bash
   git clone https://github.com/georisk/georisk-analytics.git /opt/georisk-analytics
   cd /opt/georisk-analytics
   ```

2. **Configure Environment Variables**:
   Copy `.env.production` to `.env` and set production secrets:
   ```bash
   cp .env.production .env
   nano .env
   ```

3. **Build & Start Containers**:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

4. **Verify Health**:
   ```bash
   curl http://localhost:8000/api/v1/health
   curl http://localhost:8000/api/v1/health/database
   ```

---

## 2. Cloud Platform Deployment Options

### Frontend Deployment (Vercel / Netlify)
1. Import `frontend` directory into Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable: `VITE_API_BASE_URL=https://api.georisk.internal/api/v1`

### Backend Deployment (Render / Railway / AWS EC2)
1. **Render / Railway**: Connect GitHub repository, select `Dockerfile.backend`, and attach managed PostgreSQL 16 & Redis instances.
2. **AWS EC2 / Azure App Service**: Launch container using `docker-compose.prod.yml` behind an Nginx reverse proxy with TLS certificates issued via Let's Encrypt / certbot.
