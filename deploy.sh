#!/bin/bash

# Basic Web App - VPS Deployment Script
# This script automates the deployment process on a VPS

set -e  # Exit on any error

echo "🚀 Starting Basic Web App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Get deployment directory (default: /var/www/basic-web-app)
DEPLOY_DIR=${1:-/var/www/basic-web-app}
print_status "Deployment directory: $DEPLOY_DIR"

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
    print_status "Creating deployment directory..."
    sudo mkdir -p "$DEPLOY_DIR"
    sudo chown $USER:$USER "$DEPLOY_DIR"
    print_success "Created deployment directory: $DEPLOY_DIR"
fi

# Copy files to deployment directory
print_status "Copying application files..."
cp -r ./* "$DEPLOY_DIR/" 2>/dev/null || true
print_success "Files copied successfully"

# Navigate to deployment directory
cd "$DEPLOY_DIR"

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install --production
print_success "Dependencies installed"

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs
print_success "Logs directory created"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating environment file..."
    cp .env.example .env
    print_warning "Please edit .env file with your domain and settings!"
    print_warning "nano $DEPLOY_DIR/.env"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 is not installed. Installing globally..."
    sudo npm install -g pm2
    print_success "PM2 installed"
fi

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop basic-web-app 2>/dev/null || true
pm2 delete basic-web-app 2>/dev/null || true

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
print_success "Application started with PM2"

# Setup PM2 startup (user needs to run the command it outputs)
print_status "Setting up PM2 startup..."
pm2 startup || print_warning "Please run the command above to enable PM2 startup"

# Test the application
print_status "Testing application..."
sleep 3

if curl -f -s http://localhost:3000/api/health > /dev/null; then
    print_success "✅ Application is running and responding!"
    print_success "🌐 Frontend: http://localhost:3000"
    print_success "🔧 API Health: http://localhost:3000/api/health"
else
    print_error "❌ Application is not responding. Check PM2 logs:"
    print_error "pm2 logs basic-web-app"
    exit 1
fi

# Show PM2 status
print_status "PM2 Status:"
pm2 status

echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Edit environment file: nano $DEPLOY_DIR/.env"
echo "2. Configure Nginx reverse proxy (see README.md)"
echo "3. Setup SSL certificate with Let's Encrypt"
echo "4. Configure firewall settings"
echo ""
print_status "Useful commands:"
echo "• Check status: pm2 status"
echo "• View logs: pm2 logs basic-web-app"
echo "• Restart app: pm2 restart basic-web-app"
echo "• Stop app: pm2 stop basic-web-app"
echo ""
print_success "Your Basic Web App is now running! 🚀" 