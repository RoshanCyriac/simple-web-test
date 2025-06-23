# 🐳 Docker Deployment Guide

## 📋 **Quick Start**

### **Option 1: Simple Docker Run**
```bash
# Build the image
docker build -t basic-web-app .

# Run the container
docker run -d \
  --name basic-web-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000 \
  basic-web-app
```

### **Option 2: Docker Compose (Recommended)**
```bash
# Development/Local
docker-compose up -d

# Production with Nginx
docker-compose -f docker-compose.prod.yml up -d
```

## 🏗️ **Build & Run Commands**

### **Build the Docker Image:**
```bash
docker build -t basic-web-app .
```

### **Run with Custom Environment:**
```bash
docker run -d \
  --name basic-web-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e ALLOWED_ORIGINS=http://your-domain.com,https://your-domain.com \
  -e SESSION_SECRET=your-super-secret-key-here \
  -v $(pwd)/logs:/app/logs \
  --restart unless-stopped \
  basic-web-app
```

### **Check Container Status:**
```bash
# View running containers
docker ps

# View logs
docker logs basic-web-app

# Follow logs in real-time
docker logs -f basic-web-app

# Check health
docker exec basic-web-app node healthcheck.js
```

## 🔧 **Configuration Options**

### **Environment Variables:**
```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=http://your-domain.com,https://your-domain.com,http://your-vps-ip:3000
SESSION_SECRET=your-unique-secret-key-change-this
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
APP_NAME=Basic Web App
APP_VERSION=1.0.0
TRUST_PROXY=true
COMPRESSION_LEVEL=6
```

### **Port Mapping:**
- Container port: `3000`
- Host port: `3000` (or any port you prefer)
- Example: `-p 8080:3000` (access via localhost:8080)

### **Volume Mounting:**
```bash
# Mount logs directory
-v $(pwd)/logs:/app/logs

# Mount custom config (if needed)
-v $(pwd)/config:/app/config
```

## 🚀 **Production Deployment**

### **Step 1: Update Configuration**
Edit `docker-compose.prod.yml`:
```yaml
environment:
  - ALLOWED_ORIGINS=http://your-actual-domain.com,https://your-actual-domain.com
  - SESSION_SECRET=your-production-secret-key
```

Edit `nginx.conf`:
```nginx
server_name your-actual-domain.com www.your-actual-domain.com;
```

### **Step 2: Deploy with Nginx**
```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **Step 3: SSL Setup (Optional)**
```bash
# Create SSL directory
mkdir -p ssl

# Copy your SSL certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Update nginx.conf (uncomment HTTPS server block)
# Restart nginx container
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🐳 **Docker Management**

### **Container Management:**
```bash
# Start container
docker start basic-web-app

# Stop container
docker stop basic-web-app

# Restart container
docker restart basic-web-app

# Remove container
docker rm basic-web-app

# Remove image
docker rmi basic-web-app
```

### **Docker Compose Management:**
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View service logs
docker-compose logs web
docker-compose logs nginx

# Scale services (if needed)
docker-compose up -d --scale web=3
```

### **Cleanup:**
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Clean everything
docker system prune -a
```

## 🔍 **Troubleshooting**

### **Common Issues:**

**1. Container won't start:**
```bash
# Check logs
docker logs basic-web-app

# Check if port is already in use
lsof -i :3000
```

**2. Permission issues:**
```bash
# Fix log directory permissions
sudo chown -R $(id -u):$(id -g) logs/
```

**3. Health check failing:**
```bash
# Test health check manually
docker exec basic-web-app node healthcheck.js

# Check if app is responding
docker exec basic-web-app curl http://localhost:3000/api/health
```

**4. CORS issues:**
```bash
# Update ALLOWED_ORIGINS environment variable
docker stop basic-web-app
docker rm basic-web-app
# Run with updated ALLOWED_ORIGINS
```

### **Debug Mode:**
```bash
# Run container interactively
docker run -it --rm basic-web-app sh

# Execute commands in running container
docker exec -it basic-web-app sh
```

## 📊 **Monitoring**

### **Health Checks:**
```bash
# Docker health status
docker inspect --format='{{.State.Health.Status}}' basic-web-app

# Manual health check
curl http://localhost:3000/api/health
```

### **Resource Usage:**
```bash
# Container stats
docker stats basic-web-app

# Detailed container info
docker inspect basic-web-app
```

## 🌐 **Access Your Application**

After successful deployment:

- **Frontend:** `http://localhost:3000` or `http://your-domain.com`
- **Health API:** `http://localhost:3000/api/health`
- **Data API:** `http://localhost:3000/api/data`

## 🔒 **Security Best Practices**

1. **Use non-root user** (already configured in Dockerfile)
2. **Keep base image updated** (`docker pull node:18-alpine`)
3. **Scan for vulnerabilities** (`docker scan basic-web-app`)
4. **Use secrets management** for production secrets
5. **Enable SSL/TLS** in production
6. **Regular security updates** of dependencies

## 📝 **Container Specifications**

- **Base Image:** `node:18-alpine`
- **Working Directory:** `/app`
- **Exposed Port:** `3000`
- **Health Check:** Every 30 seconds
- **Restart Policy:** `unless-stopped`
- **User:** Non-root (`nextjs:nodejs`)
- **Signal Handling:** `dumb-init` for proper process management

Your containerized web application is now ready for deployment! 🚀 