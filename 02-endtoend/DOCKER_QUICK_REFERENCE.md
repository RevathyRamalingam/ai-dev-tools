# Docker Quick Reference

## Quick Start

```bash
# Build and run
docker-compose up --build

# Access application
# http://localhost:5000

# Stop
docker-compose down
```

## Build

```bash
# Build image
docker build -t coding-platform:latest .

# Build with BuildKit (faster)
DOCKER_BUILDKIT=1 docker build -t coding-platform:latest .

# Build and run
docker run -p 5000:5000 coding-platform:latest
```

## Run

```bash
# Basic run
docker run -p 5000:5000 coding-platform:latest

# With persistent data
docker run -v ./data:/app/data -p 5000:5000 coding-platform:latest

# Background
docker run -d -p 5000:5000 coding-platform:latest

# Custom environment
docker run -e NODE_ENV=production -p 5000:5000 coding-platform:latest

# Interactive shell
docker run -it coding-platform:latest /bin/sh
```

## Docker Compose

```bash
# Start
docker-compose up

# Start background
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up --build

# View logs
docker-compose logs -f app

# Execute command
docker-compose exec app ls -la
```

## Debug

```bash
# View logs
docker logs <container-id>
docker logs -f <container-id>

# List containers
docker ps
docker ps -a

# Shell access
docker exec -it <container-id> /bin/sh

# Inspect image
docker inspect coding-platform:latest

# View layers
docker history coding-platform:latest

# Check disk usage
docker system df
```

## Cleanup

```bash
# Remove image
docker rmi coding-platform:latest

# Remove container
docker rm <container-id>

# Remove unused
docker image prune -a
docker container prune
docker system prune -a

# Stop all containers
docker stop $(docker ps -q)
```

## Image Information

```
Base Image: node:18-alpine
Size: ~300MB
Build Time: 2-3 minutes (first), 10-30s (cached)
Startup: 3-5 seconds
Production Ready: Yes
```

## Ports

```
5000 - Backend API + Frontend (Express.js)
3000 - Frontend (proxied through 5000)
```

## Useful Commands

```bash
# Find what's using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# View image size
docker images | grep coding-platform

# Get container IP
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-id>

# Copy file from container
docker cp <container-id>:/app/file.txt ./

# Copy file to container
docker cp ./file.txt <container-id>:/app/

# Run command in container
docker exec <container-id> node -v

# View resource usage
docker stats <container-id>
```
