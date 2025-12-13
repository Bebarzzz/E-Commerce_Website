#!/bin/bash

# SSL Setup Script using Let's Encrypt
# Run this after DNS is configured and pointing to your EC2 instance

set -e

echo "======================================"
echo "SSL Certificate Setup with Let's Encrypt"
echo "======================================"

# Install Certbot
echo "📦 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Prompt for domain
read -p "Enter your domain name (e.g., api.yourdomain.com): " DOMAIN

echo "🔐 Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN

# Auto-renewal test
echo "✅ Testing auto-renewal..."
sudo certbot renew --dry-run

echo ""
echo "======================================"
echo "✅ SSL Setup Complete!"
echo "======================================"
echo ""
echo "Your site is now accessible via HTTPS!"
echo "Certificate will auto-renew every 60 days."
echo ""
