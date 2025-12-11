# FastAPI + Railway Deployment Quick Start

## What Changed

**Before**: Node.js Express backend  
**Now**: Python FastAPI backend + Railway deployment

## Why FastAPI?

✅ Modern Python framework (faster than Django)  
✅ Built-in async/await support  
✅ Automatic API documentation (Swagger UI)  
✅ Great performance (comparable to Node.js)  
✅ Simple to deploy on Railway  

## Deployment Platform: Railway

### Why Railway?

| Feature | Railway | Others |
|---------|---------|--------|
| Ease | Very easy | Complex |
| Speed | ~2 min deploy | 10-30 min |
| Cost | $5+/month | $7+ |
| Git integration | Auto | Manual |
| SSL | Auto | Manual |
| Scaling | Click to enable | Complex |

## Quick Deploy (5 minutes)

### Step 1: Go to Railway
```
https://railway.app
```

### Step 2: Sign Up
```
GitHub login recommended
```

### Step 3: New Project
```
Click "New Project"
→ "Deploy from GitHub"
```

### Step 4: Connect Repo
```
Select: RevathyRamalingam/ai-dev-tools
Branch: main
```

### Step 5: Deploy
```
Railway auto-detects Dockerfile
Click "Deploy"
Wait 2-3 minutes
```

### Step 6: Access
```
Your app URL from Railway dashboard
https://your-app-xxxx.railway.app
```

## Files Created

| File | Purpose |
|------|---------|
| `main.py` | FastAPI application |
| `requirements.txt` | Python dependencies |
| `Dockerfile` | Container build (updated) |
| `railway.json` | Railway config |

## Local Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Build frontend first
cd frontend && npm run build && cd ..

# Run FastAPI
python main.py

# Access
http://localhost:5000
```

## Endpoints

| URL | Purpose |
|-----|---------|
| `https://app.railway.app/` | React frontend |
| `https://app.railway.app/health` | Health check |
| `https://app.railway.app/api/status` | API status |

## Environment Variables (in Railway)

```
PORT=5000
PYTHONUNBUFFERED=1
```

Set in Railway dashboard: Project → Settings → Variables

## Logs

```bash
# Via CLI
railway logs -f

# Via Dashboard
Project → Logs tab
```

## Monitoring

Railway provides:
- ✅ Real-time logs
- ✅ Deployment history
- ✅ Resource usage
- ✅ Health status
- ✅ Auto-restart on crash

## Cost Estimate

- **Free tier**: $0 (5GB RAM-hours)
- **Small app**: ~$5-10/month
- **Auto-scaling**: +$0.50 per GB-hour

## Docker Info

```
Base: python:3.11-slim
Size: ~150MB (Python) + ~200KB (React) = ~150MB
Build: 1-2 minutes
Startup: 5-10 seconds
```

## Troubleshooting

### Build fails
→ Check Dockerfile, requirements.txt, npm build

### App won't start
→ Check logs in Railway dashboard

### Slow performance
→ Upgrade to Pro for scaling

### Frontend not loading
→ Verify `public/` folder exists

## Next Steps

1. ✅ Code ready
2. ⏳ Create Railway account
3. ⏳ Deploy repository
4. ⏳ Get public URL
5. ⏳ Share with users

## Commands

```bash
# Local build
docker build -t app:latest .
docker run -p 5000:5000 app:latest

# CLI deploy
railway login
railway init
railway up

# View logs
railway logs --tail
```

## Summary

| Item | Value |
|------|-------|
| Platform | Railway.app |
| Framework | FastAPI |
| Runtime | Python 3.11 |
| Deploy time | ~2-3 minutes |
| Cost | $5-10/month |
| Status | ✓ Ready |

**Your app is ready to deploy on Railway!**
