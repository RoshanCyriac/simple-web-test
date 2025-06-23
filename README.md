# Basic Web App - Frontend & Backend Connection Demo

A production-ready web application demonstrating frontend-backend connectivity, designed for manual deployment on VPS/Droplet.

## 🚀 Features

- **Frontend**: Modern, responsive HTML/CSS/JavaScript interface
- **Backend**: Node.js/Express.js API server with production middleware
- **Real-time Connection Testing**: Live API connectivity demonstration
- **Production Ready**: Security headers, compression, error handling
- **Process Management**: PM2 configuration for production deployment

## 📋 Prerequisites

Before deploying on your VPS, ensure you have:

- Node.js (v16 or higher)
- npm (comes with Node.js)
- PM2 (for production process management)

## 🛠️ VPS Deployment Instructions

### 1. Prepare Your VPS

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/basic-web-app
sudo chown $USER:$USER /var/www/basic-web-app
```

### 2. Deploy Application Files

Upload all project files to your VPS:

```bash
# Option 1: Using SCP
scp -r ./* user@your-server-ip:/var/www/basic-web-app/

# Option 2: Using Git (if you have a repository)
cd /var/www/basic-web-app
git clone your-repository-url .

# Option 3: Using rsync
rsync -avz --exclude node_modules ./ user@your-server-ip:/var/www/basic-web-app/
```

### 3. Install Dependencies

```bash
cd /var/www/basic-web-app
npm install --production
```

### 4. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

Update the `.env` file with your domain:
```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=http://your-domain.com,https://your-domain.com
```

### 5. Create Log Directory

```bash
mkdir -p logs
```

### 6. Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### 7. Configure Reverse Proxy (Nginx)

Install and configure Nginx:

```bash
# Install Nginx
sudo apt install nginx -y

# Create site configuration
sudo nano /etc/nginx/sites-available/basic-web-app
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/basic-web-app /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 8. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 9. SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Management Commands

### PM2 Process Management

```bash
# Check application status
pm2 status

# View logs
pm2 logs basic-web-app

# Restart application
pm2 restart basic-web-app

# Stop application
pm2 stop basic-web-app

# Monitor in real-time
pm2 monit
```

### Application Testing

```bash
# Test health endpoint
curl http://your-domain.com/api/health

# Test data endpoint
curl http://your-domain.com/api/data
```

## 📁 Project Structure

```
basic-web-app/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── ecosystem.config.js    # PM2 configuration
├── .env.example          # Environment variables template
├── README.md             # This file
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   ├── styles.css        # CSS styles
│   └── script.js         # Frontend JavaScript
└── logs/                 # Application logs (created automatically)
```

## 🌐 API Endpoints

- `GET /` - Serves the frontend application
- `GET /api/health` - Health check endpoint
- `GET /api/data` - Sample data endpoint
- `POST /api/echo` - Echo POST data back

## 🔍 Testing the Connection

Once deployed, visit your domain in a browser. The application will:

1. **Automatically test backend connectivity** on page load
2. **Display connection status** with visual indicators
3. **Provide interactive buttons** to test different API endpoints
4. **Show real-time responses** from the backend
5. **Monitor connection health** every 30 seconds

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission denied**:
   ```bash
   sudo chown -R $USER:$USER /var/www/basic-web-app
   ```

3. **Nginx configuration errors**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **PM2 not starting**:
   ```bash
   pm2 logs basic-web-app
   pm2 restart basic-web-app
   ```

### Log Files

- Application logs: `./logs/`
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `pm2 logs`

## 📊 Monitoring

The application includes:

- Health check endpoint for monitoring services
- Automatic connection status updates
- Error handling and logging
- Graceful shutdown handling
- Memory usage monitoring via PM2

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation
- Error message sanitization in production
- Rate limiting ready (configurable)

## 📝 License

MIT License - feel free to use this for your projects!

---

**🎉 Your basic web app is now ready for production deployment!**

Visit your domain to see the frontend-backend connection in action. 