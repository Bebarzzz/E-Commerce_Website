#!/bin/bash

# EC2 Setup Script for E-Commerce Backend
# Run this script on your EC2 instance after launching

set -e

echo "======================================"
echo "E-Commerce Backend Setup for EC2"
echo "======================================"

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install nginx
echo "📦 Installing nginx..."
sudo apt install -y nginx

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Git if not present
echo "📦 Installing Git..."
sudo apt install -y git

# Create application directory
echo "📁 Creating application directory..."
cd /home/ubuntu
if [ ! -d "E-Commerce_Website" ]; then
    echo "Please clone your repository manually:"
    echo "git clone https://github.com/Bebarzzz/E-Commerce_Website.git"
    echo "Then run: cd E-Commerce_Website/backend && bash setup-ec2.sh"
    exit 1
fi

cd E-Commerce_Website/backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install --production

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs
mkdir -p upload

# Create .env file
echo "⚙️  Creating .env file..."
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file with your actual values:"
    echo "   nano .env"
    echo ""
fi

# Setup nginx configuration
echo "⚙️  Setting up nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/ecommerce
sudo ln -sf /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "✅ Testing nginx configuration..."
sudo nginx -t

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit /home/ubuntu/E-Commerce_Website/backend/.env with your credentials"
echo "2. Update nginx.conf with your domain name"
echo "3. Restart services:"
echo "   pm2 restart ecommerce-backend"
echo "   sudo systemctl restart nginx"
echo "4. Test the API: curl http://localhost/api/health"
echo ""
echo "To view logs:"
echo "  pm2 logs ecommerce-backend"
echo ""
echo "To monitor PM2:"
echo "  pm2 monit"
echo ""
