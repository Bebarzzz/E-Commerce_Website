# Deployment & Operations Guide

Complete guide for deploying and operating the E-Commerce Car Dealership platform in production.

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [Environment Configuration](#environment-configuration)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Process Management with PM2](#process-management-with-pm2)
- [Nginx Configuration](#nginx-configuration)
- [Database Management](#database-management)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Security Best Practices](#security-best-practices)
- [Scaling Strategies](#scaling-strategies)
- [Maintenance](#maintenance)

---

## Deployment Overview

### Architecture

```
Internet
    ↓
[CloudFlare/DNS]
    ↓
[AWS EC2 Instance]
    ↓
[Nginx (Port 80/443)]
    ↓
[PM2 Process Manager]
    ↓
[Node.js Backend (Port 4000)]
    ↓
[MongoDB Atlas]
    
[AWS S3] ← Image Storage
```

### Technology Stack

- **Server**: AWS EC2 (Ubuntu 22.04 LTS)
- **Web Server**: Nginx (reverse proxy)
- **Process Manager**: PM2
- **Runtime**: Node.js v18+
- **Database**: MongoDB Atlas (cloud)
- **Storage**: AWS S3
- **SSL**: Let's Encrypt (Certbot)
- **Frontend**: React (static build served by Nginx)

---

## AWS EC2 Deployment

### Prerequisites

- AWS Account
- EC2 instance (t2.micro or larger)
- Ubuntu 22.04 LTS
- Elastic IP assigned
- Security group configured

### Security Group Configuration

**Inbound Rules:**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web |
| Custom | TCP | 4000 | 127.0.0.1 | Backend (internal) |

### Initial Server Setup

**1. Connect to EC2:**

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

**2. Run Automated Setup:**

The project includes `backend/setup-ec2.sh` for automated setup:

```bash
# Download and run setup script
curl -o setup-ec2.sh https://raw.githubusercontent.com/your-repo/backend/setup-ec2.sh
chmod +x setup-ec2.sh
sudo ./setup-ec2.sh
```

**What the script does:**
- Installs Node.js v18
- Installs and configures Nginx
- Installs PM2 globally
- Creates necessary directories
- Sets up firewall (UFW)

**3. Manual Setup (if not using script):**

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install build tools
sudo apt install -y build-essential

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Deploy Application

**1. Clone Repository:**

```bash
# Clone from GitHub
cd /home/ubuntu
git clone https://github.com/your-username/E-Commerce_Website.git
cd E-Commerce_Website
```

**2. Setup Backend:**

```bash
cd backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add production environment variables (see Environment Configuration)

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command that PM2 outputs
```

**3. Build and Deploy Frontend:**

```bash
cd ../frontend

# Install dependencies
npm install

# Create production .env
echo "REACT_APP_API_URL=https://your-domain.com/api" > .env

# Build
npm run build

# Copy build to Nginx directory
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

---

## Environment Configuration

### Backend Environment Variables

```bash
# /home/ubuntu/E-Commerce_Website/backend/.env

# Server
NODE_ENV=production
PORT=4000

# Database
MONGO_URI=

# Authentication
JWT_SECRET=your_very_strong_random_secret_min_32_characters

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# AWS S3
S3_BUCKET=your-production-bucket
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Claude AI
CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```

### Frontend Environment Variables

```bash
# Build-time only
REACT_APP_API_URL=https://your-domain.com/api
```

### Security Notes

- Never commit `.env` files to Git
- Use strong, random JWT secrets (min 32 characters)
- Rotate secrets periodically
- Use AWS IAM roles when possible (instead of keys)
- Store secrets in AWS Secrets Manager for enhanced security

---

## SSL Certificate Setup

### Using Let's Encrypt (Recommended)

**1. Run SSL Setup Script:**

```bash
# Use provided script
cd /home/ubuntu/E-Commerce_Website/backend
sudo ./setup-ssl.sh your-domain.com your-email@example.com
```

**2. Manual Setup:**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS (recommended)

# Verify auto-renewal
sudo certbot renew --dry-run
```

**3. Certificate Renewal:**

Certbot automatically sets up a cron job for renewal. Verify:

```bash
# Check renewal timer
sudo systemctl status certbot.timer

# Manual renewal test
sudo certbot renew --dry-run
```

### SSL Certificate Locations

```
Certificate: /etc/letsencrypt/live/your-domain.com/fullchain.pem
Private Key: /etc/letsencrypt/live/your-domain.com/privkey.pem
```

---

## Process Management with PM2

### PM2 Configuration

**Ecosystem File** (`backend/ecosystem.config.js`):

```javascript
module.exports = {
  apps: [{
    name: 'car-dealership-api',
    script: './server.js',
    instances: 2, // or 'max' for CPU count
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',
    watch: false
  }]
};
```

### PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# View status
pm2 status
pm2 list

# View logs
pm2 logs
pm2 logs car-dealership-api
pm2 logs --lines 100

# Restart
pm2 restart car-dealership-api
pm2 restart all

# Stop
pm2 stop car-dealership-api
pm2 delete car-dealership-api

# Monitor
pm2 monit

# Save process list
pm2 save

# Setup startup script
pm2 startup
pm2 save

# Update PM2
npm install -g pm2
pm2 update
```

### PM2 Monitoring

```bash
# Install PM2 web interface (optional)
pm2 install pm2-server-monit

# View real-time dashboard
pm2 monit

# Generate startup script
pm2 startup systemd
```

---

## Nginx Configuration

### Main Configuration

**File:** `/etc/nginx/sites-available/default`

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory for React build
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Frontend routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable logging for static files
    location = /favicon.ico { 
        log_not_found off; 
        access_log off; 
    }
    
    location = /robots.txt { 
        log_not_found off; 
        access_log off; 
    }
}
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Performance Tuning

**Edit:** `/etc/nginx/nginx.conf`

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M; # For image uploads
    
    # Include other configs
    include /etc/nginx/mime.types;
    include /etc/nginx/sites-enabled/*;
}
```

---

## Database Management

### MongoDB Atlas Setup

**1. Create Cluster:**
- Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create free tier cluster (M0)
- Choose region closest to EC2
- Create database user with strong password

**2. Network Access:**
- Add EC2 instance IP to whitelist
- Or allow all IPs (0.0.0.0/0) with strong credentials

**3. Connection String:**
```
mongodb+srv://username:password@cluster.mongodb.net/car-dealership?retryWrites=true&w=majority
```

### Database Backups

**Automated Backups (MongoDB Atlas):**
- Free tier: No automatic backups
- Paid tiers: Continuous backups with point-in-time recovery

**Manual Backups:**

```bash
# Export database
mongodump --uri="you mnogo uri" \
  --out=/home/ubuntu/backups/$(date +%Y%m%d)

# Compress backup
tar -czf backup-$(date +%Y%m%d).tar.gz /home/ubuntu/backups/$(date +%Y%m%d)

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

**Automated Backup Script:**

```bash
#!/bin/bash
# /home/ubuntu/scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
MONGO_URI="your_mongodb_uri"

# Create backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"

# Compress
tar -czf "$BACKUP_DIR/$DATE.tar.gz" "$BACKUP_DIR/$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$DATE.tar.gz" s3://your-backup-bucket/db-backups/

# Clean old local backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Schedule with Cron:**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/ubuntu/scripts/backup-db.sh >> /home/ubuntu/logs/backup.log 2>&1
```

### Database Restore

```bash
# Download backup from S3
aws s3 cp s3://your-backup-bucket/db-backups/backup-20241220.tar.gz .

# Extract
tar -xzf backup-20241220.tar.gz

# Restore
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/car-dealership" \
  --drop ./backup-20241220
```

---

## Monitoring & Logging

### Application Logs

**PM2 Logs:**

```bash
# View all logs
pm2 logs

# Specific app
pm2 logs car-dealership-api

# Last 100 lines
pm2 logs --lines 100

# Follow logs in real-time
pm2 logs --lines 0

# Log files location
/home/ubuntu/E-Commerce_Website/backend/logs/
```

**Nginx Logs:**

```bash
# Access log
sudo tail -f /var/log/nginx/access.log

# Error log
sudo tail -f /var/log/nginx/error.log

# Analyze with GoAccess (install first)
sudo goaccess /var/log/nginx/access.log -o /var/www/html/report.html --log-format=COMBINED
```

### System Monitoring

**Basic Monitoring:**

```bash
# System resources
htop

# Disk usage
df -h

# Memory usage
free -m

# Network connections
netstat -tuln
```

**Advanced Monitoring with CloudWatch:**

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Configure and start
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### Performance Monitoring

**PM2 Plus (Optional - Paid Service):**

```bash
# Link to PM2 Plus
pm2 link your-secret-key your-public-key

# Provides:
# - Real-time monitoring
# - Exception tracking
# - Deployment tracking
# - Custom metrics
```

### Error Tracking

**Recommended: Sentry Integration**

```bash
# Install Sentry SDK
npm install @sentry/node

# In server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## Backup & Recovery

### Complete System Backup

**1. Application Code:**

```bash
# Backup from Git repository
git archive --format=tar.gz -o backup.tar.gz main
```

**2. Uploaded Files (Local Storage):**

```bash
# Backup upload folder
tar -czf uploads-$(date +%Y%m%d).tar.gz /home/ubuntu/E-Commerce_Website/backend/upload/
aws s3 cp uploads-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/uploads/
```

**3. Environment Configuration:**

```bash
# Backup .env files (encrypt first!)
tar -czf env-config.tar.gz backend/.env frontend/.env
gpg -c env-config.tar.gz  # Encrypt with password
aws s3 cp env-config.tar.gz.gpg s3://your-backup-bucket/config/
```

**4. PM2 Process List:**

```bash
pm2 save
# Saves to ~/.pm2/dump.pm2
```

### Disaster Recovery Plan

**Recovery Steps:**

1. **Provision New EC2 Instance**
2. **Run Setup Script**
3. **Restore Application Code**
   ```bash
   git clone https://github.com/your-repo/E-Commerce_Website.git
   ```
4. **Restore Environment Variables**
5. **Restore Database** (from MongoDB backup)
6. **Start Services**
   ```bash
   pm2 resurrect  # or pm2 start ecosystem.config.js
   ```
7. **Restore Nginx Configuration**
8. **Setup SSL**
9. **Test Everything**

---

## Security Best Practices

### Server Hardening

```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### Application Security

- ✅ Use HTTPS everywhere
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use parameterized queries (Mongoose)
- ✅ Keep dependencies updated
- ✅ Use helmet.js for security headers
- ✅ Implement CSRF protection
- ✅ Sanitize user inputs
- ✅ Use strong JWT secrets
- ✅ Implement proper CORS

### AWS Security

- Use IAM roles instead of access keys
- Enable S3 bucket versioning
- Implement S3 bucket policies
- Use VPC for network isolation
- Enable AWS CloudTrail for auditing
- Regular security scans

---

## Scaling Strategies

### Vertical Scaling

Upgrade EC2 instance type:
- t2.micro → t2.small → t2.medium
- Requires downtime
- Simple but limited

### Horizontal Scaling

**1. Load Balancer:**
- AWS Application Load Balancer
- Multiple EC2 instances
- Auto-scaling groups

**2. Database Scaling:**
- MongoDB Atlas auto-scaling
- Read replicas
- Sharding for large datasets

**3. Static Asset Delivery:**
- CloudFront CDN
- S3 for static files
- Improved global performance

### Caching Strategy

**Redis/Memcached:**
```bash
# Install Redis
sudo apt install redis-server

# In application
npm install redis
```

**Application-level caching:**
```javascript
// Cache frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

---

## Maintenance

### Regular Tasks

**Daily:**
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Review disk space

**Weekly:**
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Verify backups
- [ ] Review access logs

**Monthly:**
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Backup verification (test restore)

### Update Procedures

**Application Updates:**

```bash
# Pull latest code
cd /home/ubuntu/E-Commerce_Website
git pull origin main

# Backend updates
cd backend
npm install
pm2 restart car-dealership-api

# Frontend updates
cd ../frontend
npm install
npm run build
sudo cp -r build/* /var/www/html/
```

**Dependency Updates:**

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Major version updates (careful!)
npm install package@latest
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed troubleshooting guide.

**Quick Checks:**

```bash
# Is backend running?
pm2 status

# Is Nginx running?
sudo systemctl status nginx

# Check backend logs
pm2 logs --lines 50

# Check Nginx logs
sudo tail -100 /var/log/nginx/error.log

# Test backend directly
curl http://localhost:4000/api/health

# Test Nginx
sudo nginx -t
```

---

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)

---

**Last Updated:** December 20, 2025  
**Version:** 1.0
