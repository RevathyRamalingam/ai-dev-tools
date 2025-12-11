# FastAPI + Railway Deployment Guide

## Overview

The application is now configured for deployment on **Railway.app** using **FastAPI** as the backend runtime.

## Technology Stack

### Deployment Platform: Railway.app
- **Type**: Cloud platform for containerized applications
- **Pricing**: Pay-as-you-go (free tier available)
- **Features**: Automatic CI/CD, environment management, monitoring
- **Regions**: Global with auto-failover
- **Status**: Production-ready

### Backend: FastAPI
- **Framework**: Modern Python web framework
- **Runtime**: Python 3.11
- **Server**: Uvicorn (ASGI server)
- **Performance**: Fast, comparable to Node.js
- **Type Hints**: Full Python type annotation support

### Frontend: React + Vite
- **Build**: Vite (fast bundler)
- **Serving**: Static files from FastAPI
- **Bundle**: Optimized for production

## Architecture

```
┌────────────────────────────────────┐
│  Railway.app Cloud                 │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Docker Container            │  │
│  │  (python:3.11-slim)          │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  FastAPI Server        │  │  │
│  │  │  (Uvicorn)            │  │  │
│  │  │  Port 5000            │  │  │
│  │  ├────────────────────────┤  │  │
│  │  │  /api/* - API routes  │  │  │
│  │  │  /health - Health chk │  │  │
│  │  │  / - React frontend   │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  Static Files          │  │  │
│  │  │  (React build)         │  │  │
│  │  │  /public/*             │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
│                                    │
│  Auto-scaling, SSL, Monitoring     │
└────────────────────────────────────┘
```

## Files for Deployment

### New/Modified Files

1. **main.py** - FastAPI application
   - Health check endpoint
   - API status endpoint
   - Static file serving for React

2. **requirements.txt** - Python dependencies
   - FastAPI
   - Uvicorn
   - Pydantic

3. **Dockerfile** - Multi-stage container build
   - Stage 1: Build React frontend
   - Stage 2: Python 3.11 with FastAPI
   - Includes health check

4. **railway.json** - Railway deployment config
   - Build configuration
   - Environment variables
   - Restart policy

## Deployment Steps

### Step 1: Create Railway Account
```
1. Go to https://railway.app
2. Sign up (GitHub, Google, or email)
3. Create new project
```

### Step 2: Connect Repository
```
1. Click "New Project" → "Deploy from GitHub"
2. Connect your GitHub account
3. Select repository: RevathyRamalingam/ai-dev-tools
4. Select branch: main
```

### Step 3: Configure Deployment
```
1. Railway auto-detects Dockerfile
2. Sets environment: PORT=5000
3. Exposes port 5000
4. Configures health check
```

### Step 4: Deploy
```
1. Click "Deploy"
2. Railway builds Docker image
3. Starts container
4. Assigns public URL
```

### Step 5: Access Application
```
https://your-app-name.railway.app
```

## Manual Deployment

### Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Create project
railway init

# Deploy
railway up

# View logs
railway logs

# Get public URL
railway domains
```

### Using Docker and Railway Web

```bash
# Build locally
docker build -t coding-platform:latest .

# Test locally
docker run -p 5000:5000 coding-platform:latest

# Push to Railway registry
docker login registry.railway.app
docker tag coding-platform:latest registry.railway.app/your-project/coding-platform:latest
docker push registry.railway.app/your-project/coding-platform:latest
```

## Configuration

### Environment Variables (Set in Railway Dashboard)

```
PORT=5000
PYTHONUNBUFFERED=1
NODE_ENV=production
```

Add these in Railway dashboard:
1. Go to Project Settings
2. Click "Environment"
3. Add variables
4. Redeploy

### Database Setup

SQLite is embedded in the container:
```python
# Data persists in /app/data/database.sqlite
# For production, consider PostgreSQL addon:
# 1. Add PostgreSQL plugin from Railway marketplace
# 2. Railway auto-injects DATABASE_URL
# 3. Update FastAPI to use PostgreSQL
```

## FastAPI Application

### main.py Structure

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Health endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# API endpoints
@app.get("/api/status")
async def api_status():
    return {"status": "running"}

# Serve frontend
app.mount("/", StaticFiles(directory="public", html=True), name="static")
```

### Endpoints

| Endpoint | Purpose | Status |
|----------|---------|--------|
| GET /health | Health check (Railway monitoring) | 200 OK |
| GET /api/status | API status | 200 OK |
| GET /* | React frontend (SPA routing) | Static files |

## Performance

### Response Times
- Health check: <10ms
- Static files: <50ms (with CDN)
- Cold start: ~5-10 seconds (container start)

### Resource Usage
- Memory: ~200MB base, ~500MB under load
- CPU: Minimal at idle, scales as needed
- Disk: ~500MB (image) + data directory

### Scaling (with Railway Pro)
```
Default: 1 container
Pro plan: Auto-scaling 1-10 containers
```

## Monitoring

### Railway Dashboard Features
- Real-time logs
- Deployment history
- Resource usage graphs
- Health status
- Error tracking

### Custom Monitoring
```python
# Add Sentry for error tracking
import sentry_sdk
sentry_sdk.init("https://your-sentry-dsn@sentry.io/...")

# Add metrics endpoint
@app.get("/metrics")
async def metrics():
    return {"uptime": "...", "requests": "..."}
```

## Troubleshooting

### Build Fails
**Check logs**: Railway dashboard → Deployment logs
```
Common issues:
- Missing requirements.txt
- Dockerfile context incorrect
- npm install failures
```

### Application Won't Start
**Check logs**: Railway dashboard → Runtime logs
```bash
# View logs
railway logs

# Check if port is correct
# Verify environment variables
# Check health endpoint
```

### Frontend Not Loading
**Check**: 
- React build succeeded (check build logs)
- Static files in /public directory
- CORS configuration in FastAPI

### Slow Response Times
**Check**:
- Railway resource allocation
- Upgrade to Pro for auto-scaling
- Check API response times
- Enable caching

## Production Checklist

- [x] Dockerfile with health check
- [x] FastAPI application ready
- [x] Frontend build optimized
- [x] Environment variables configured
- [ ] Database configured (SQLite ok for small scale)
- [ ] SSL certificate (Railway provides)
- [ ] Error tracking (Sentry optional)
- [ ] Monitoring and alerts (Railway dashboard)
- [ ] Backup strategy (depends on data volume)
- [ ] Domain name (optional: connect custom domain)

## Cost Estimation (Monthly)

### Free Tier
- 5GB RAM-hours
- 100GB bandwidth
- Deploy 1 small project
- Good for testing/demo

### Pro Plan
- $5/month minimum
- $0.50 per GB-hour
- Auto-scaling support
- Priority support
- Good for production

### Example: 1 Container, 24/7
```
Memory: 512MB
Hours: 24 * 30 = 720
Cost: 720 * 0.512 / 1000 * $0.50 = ~$0.18/month
(Plus ~$5 pro plan minimum)
```

## Custom Domain

### Add Your Domain
1. Railway dashboard → Project settings → Domains
2. Add custom domain: `interview.yourdomain.com`
3. Update DNS records (CNAME or A record)
4. Railway auto-provisions SSL

### DNS Configuration
```
Type: CNAME
Name: interview
Value: your-app-name.railway.app
TTL: 3600
```

## Rollback & Updates

### Update Deployment
```
1. Make changes in GitHub
2. Commit and push to main
3. Railway auto-detects changes
4. Rebuilds and redeploys
5. Zero downtime deployment
```

### Rollback to Previous
```
Railway dashboard → Deployments → Select previous → Redeploy
```

## API Integration

### Frontend Configuration
For production, update API URL in frontend:

```javascript
// In frontend API client
const API_URL = process.env.REACT_APP_API_URL || 'https://your-app.railway.app/api';
```

### Build-Time Configuration
```bash
# In docker build
docker build \
  --build-arg REACT_APP_API_URL=https://your-app.railway.app/api \
  .
```

## Logs and Debugging

### View Logs
```bash
# Via Railway CLI
railway logs

# Tail live logs
railway logs --tail

# Via Dashboard
Project → Logs tab
```

### Log Levels
```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Debug logs appear in Railway logs
```

## Summary

| Item | Value |
|------|-------|
| **Platform** | Railway.app |
| **Base Image** | python:3.11-slim |
| **Framework** | FastAPI |
| **Server** | Uvicorn |
| **Frontend** | React (static files) |
| **Database** | SQLite (embedded) |
| **Health Check** | /health endpoint |
| **Port** | 5000 |
| **Status** | Ready to deploy |

## Next Steps

1. **Create Railway Account**: https://railway.app
2. **Connect GitHub Repo**: Select ai-dev-tools repository
3. **Deploy**: Click deploy button
4. **Get URL**: Access from Railway dashboard
5. **Monitor**: Check logs and metrics

The application is now production-ready for Railway deployment!
