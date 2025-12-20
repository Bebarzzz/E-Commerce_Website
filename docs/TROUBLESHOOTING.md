# Troubleshooting Guide

Common issues and solutions for the E-Commerce Car Dealership platform.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Server Issues](#server-issues)
- [Database Problems](#database-problems)
- [Authentication Issues](#authentication-issues)
- [API Errors](#api-errors)
- [Frontend Issues](#frontend-issues)
- [File Upload Problems](#file-upload-problems)
- [Chatbot Issues](#chatbot-issues)
- [Deployment Problems](#deployment-problems)
- [Performance Issues](#performance-issues)
- [Error Reference](#error-reference)

---

## Quick Diagnostics

### Health Check Commands

```bash
# Backend health
curl http://localhost:4000/api/health

# Check backend process
pm2 status

# Check Nginx
sudo systemctl status nginx

# Test database connection
mongo "your_mongodb_uri" --eval "db.adminCommand('ping')"

# Check disk space
df -h

# Check memory
free -m

# Check logs
pm2 logs --lines 50
```

### Common Quick Fixes

```bash
# Restart backend
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx

# Clear PM2 logs
pm2 flush

# Reload Nginx config
sudo nginx -t && sudo systemctl reload nginx
```

---

## Server Issues

### Server Won't Start

**Symptom:** Backend fails to start or crashes immediately

**Possible Causes:**

1. **Port Already in Use**
   ```bash
   # Check what's using port 4000
   sudo lsof -i :4000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Environment Variables Missing**
   ```bash
   # Verify .env file exists
   ls -la backend/.env
   
   # Check contents (be careful with sensitive data)
   cat backend/.env | grep -v "SECRET\|PASSWORD"
   ```

3. **Node Modules Issues**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Syntax Errors**
   ```bash
   # Check for syntax errors
   node -c server.js
   ```

**Solution:**
```bash
# Check PM2 error logs
pm2 logs car-dealership-api --err --lines 100

# Try starting manually to see errors
cd backend
node server.js
```

---

### Server Keeps Crashing

**Symptom:** Application restarts repeatedly

**Check PM2 Logs:**
```bash
pm2 logs --lines 200
pm2 show car-dealership-api
```

**Common Causes:**

1. **Memory Leak**
   ```bash
   # Check memory usage
   pm2 monit
   
   # Increase max memory in ecosystem.config.js
   max_memory_restart: '1G'  # Increase from 500M
   ```

2. **Uncaught Exceptions**
   ```javascript
   // Add to server.js
   process.on('uncaughtException', (error) => {
     console.error('Uncaught Exception:', error);
     // Log to file or monitoring service
   });
   
   process.on('unhandledRejection', (reason, promise) => {
     console.error('Unhandled Rejection:', reason);
   });
   ```

3. **Database Connection Issues**
   - Check MongoDB Atlas status
   - Verify connection string
   - Check network access whitelist

---

### 502 Bad Gateway

**Symptom:** Nginx shows 502 error

**Causes:**

1. **Backend Not Running**
   ```bash
   pm2 status
   # If stopped, start it:
   pm2 start ecosystem.config.js
   ```

2. **Wrong Port Configuration**
   ```bash
   # Check Nginx config
   sudo nginx -t
   
   # Verify backend port in .env matches Nginx proxy_pass
   grep PORT backend/.env
   grep proxy_pass /etc/nginx/sites-available/default
   ```

3. **Firewall Blocking**
   ```bash
   sudo ufw status
   # Ensure port 4000 is allowed for localhost
   ```

**Solution:**
```bash
# Test backend directly
curl http://localhost:4000/api/health

# If that works, issue is with Nginx
sudo systemctl restart nginx
```

---

### 504 Gateway Timeout

**Symptom:** Requests timeout

**Causes:**

1. **Slow Database Queries**
   - Add indexes to frequently queried fields
   - Optimize query logic

2. **External API Delays** (Chatbot)
   - Claude API may be slow
   - Implement timeouts

3. **Increase Nginx Timeouts**
   ```nginx
   # In /etc/nginx/sites-available/default
   location /api/ {
       proxy_connect_timeout 120s;
       proxy_send_timeout 120s;
       proxy_read_timeout 120s;
   }
   ```

---

## Database Problems

### Can't Connect to MongoDB

**Symptom:** "MongoNetworkError" or "Authentication failed"

**Checks:**

1. **Verify Connection String**
   ```bash
   # Test connection
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/"
   ```

2. **Network Access**
   - Check MongoDB Atlas dashboard
   - Add server IP to whitelist
   - Or temporarily use 0.0.0.0/0 to test

3. **Credentials**
   - Verify username/password
   - Check for special characters in password (URL encode if needed)
   - Ensure user has correct permissions

4. **Connection Limit Reached**
   - Free tier has connection limits
   - Check active connections in Atlas dashboard

**Solution:**
```javascript
// Add retry logic in server.js
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }
};
```

---

### Data Not Saving

**Symptom:** POST/PATCH requests succeed but data not in database

**Checks:**

1. **Validation Errors**
   ```bash
   # Check backend logs
   pm2 logs --lines 50
   ```

2. **Schema Mismatch**
   - Verify all required fields are provided
   - Check data types match schema

3. **Transaction Failures**
   ```javascript
   // Add better error handling
   try {
     const car = await Car.create(carData);
     res.status(200).json({ success: true, car });
   } catch (error) {
     console.error('Save error:', error);
     res.status(400).json({ error: error.message });
   }
   ```

---

### Slow Queries

**Symptom:** API requests take too long

**Solutions:**

1. **Add Indexes**
   ```javascript
   // In carModel.js
   carSchema.index({ brand: 1, model: 1 });
   carSchema.index({ price: 1 });
   carSchema.index({ condition: 1 });
   ```

2. **Optimize Queries**
   ```javascript
   // Instead of loading all fields
   const cars = await Car.find().select('brand model price images');
   
   // Use pagination
   const cars = await Car.find()
     .limit(20)
     .skip(page * 20);
   ```

3. **Use Lean Queries** (for read-only)
   ```javascript
   const cars = await Car.find().lean();
   ```

---

## Authentication Issues

### "Request is not authorized"

**Symptom:** 401 error on protected routes

**Checks:**

1. **Token Missing**
   ```javascript
   // Frontend: Verify token is sent
   const headers = {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
   };
   ```

2. **Token Expired**
   - Tokens expire after 3 days
   - User needs to login again
   - Implement token refresh logic

3. **Invalid Token**
   ```bash
   # Check JWT_SECRET matches between .env files (dev/prod)
   ```

4. **Middleware Not Applied**
   ```javascript
   // Verify routes use requireAuth
   router.post('/addcar', requireAuth, addCar);
   ```

---

### "User is not authorized to perform this action"

**Symptom:** 403 error for admin routes

**Checks:**

1. **User Not Admin**
   ```javascript
   // Check user role in database
   db.users.findOne({ email: "user@example.com" })
   
   // Update to admin if needed
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   );
   ```

2. **Role Check in Middleware**
   ```javascript
   // Verify requireAuth.js checks role
   if (req.user.role !== 'admin') {
     return res.status(403).json({ 
       error: 'User is not authorized to perform this action' 
     });
   }
   ```

---

### Can't Login After Registration

**Symptom:** Registration succeeds, but login fails

**Checks:**

1. **Password Hashing**
   - Verify bcrypt is working
   - Check salt rounds

2. **Case Sensitivity**
   - Email should be case-insensitive
   ```javascript
   const email = req.body.email.toLowerCase();
   ```

3. **Database Delay**
   - Wait a moment after registration
   - Or return token immediately on signup

---

## API Errors

### CORS Errors

**Symptom:** "Access-Control-Allow-Origin" error in browser

**Solutions:**

1. **Check ALLOWED_ORIGINS**
   ```bash
   # Verify .env has correct frontend URL
   grep ALLOWED_ORIGINS backend/.env
   ```

2. **Update CORS Config**
   ```javascript
   // In server.js
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS.split(','),
     credentials: true
   }));
   ```

3. **Development vs Production**
   ```javascript
   const allowedOrigins = process.env.NODE_ENV === 'production'
     ? process.env.ALLOWED_ORIGINS.split(',')
     : ['http://localhost:3000'];
   ```

---

### 404 Not Found on API Routes

**Symptom:** API endpoints return 404

**Checks:**

1. **Route Registration**
   ```javascript
   // Verify in server.js
   app.use('/api/car', carRoute);
   app.use('/api/user', userRoute);
   app.use('/api/order', orderRoute);
   ```

2. **Base Path**
   ```javascript
   // Frontend - ensure API_BASE_URL includes /api
   const API_BASE_URL = 'http://localhost:4000/api';
   ```

3. **Nginx Proxy**
   ```nginx
   # Check Nginx config
   location /api/ {
       proxy_pass http://localhost:4000/api/;
   }
   ```

---

### Request Validation Errors

**Symptom:** "All fields required" or similar validation errors

**Solutions:**

1. **Check Request Body**
   ```javascript
   // Frontend - ensure Content-Type header
   headers: {
     'Content-Type': 'application/json'
   }
   ```

2. **FormData vs JSON**
   ```javascript
   // For file uploads, use FormData (don't set Content-Type)
   const formData = new FormData();
   formData.append('brand', 'Toyota');
   
   // For JSON
   body: JSON.stringify(data)
   ```

3. **Log Request Data**
   ```javascript
   // In controller
   console.log('Received data:', req.body);
   ```

---

## Frontend Issues

### White Screen / Blank Page

**Symptom:** App doesn't load, shows blank screen

**Checks:**

1. **Build Errors**
   ```bash
   cd frontend
   npm run build
   # Check for errors in output
   ```

2. **Console Errors**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **API URL**
   ```javascript
   // Verify .env has correct API URL
   console.log(process.env.REACT_APP_API_URL);
   ```

4. **React Router**
   ```javascript
   // Ensure BrowserRouter wraps app
   <BrowserRouter>
     <App />
   </BrowserRouter>
   ```

---

### Components Not Updating

**Symptom:** UI doesn't reflect state changes

**Solutions:**

1. **State Immutability**
   ```javascript
   // Wrong
   cart[itemId] = quantity;
   setCart(cart);
   
   // Correct
   setCart({ ...cart, [itemId]: quantity });
   ```

2. **useEffect Dependencies**
   ```javascript
   useEffect(() => {
     fetchData();
   }, [dependency]); // Add all dependencies
   ```

3. **Context Provider**
   - Ensure components are wrapped in provider
   - Verify context value is updated

---

### Images Not Loading

**Symptom:** Broken image icons or 404 for images

**Checks:**

1. **Image URLs**
   ```javascript
   // Check if URLs are correct
   console.log('Image URL:', car.images[0]);
   ```

2. **S3 Bucket Permissions**
   - Verify bucket is public or has correct policy
   - Check CORS configuration

3. **CORS on S3**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

4. **Local Development**
   - Check if backend/upload folder exists
   - Verify files were uploaded correctly

---

## File Upload Problems

### "Maximum 5 images allowed"

**Symptom:** Error even with ≤5 images

**Solution:**

```javascript
// Check file input
<input 
  type="file" 
  multiple 
  accept="image/*"
  onChange={(e) => {
    if (e.target.files.length > 5) {
      alert('Maximum 5 images allowed');
      e.target.value = '';
    }
  }}
/>
```

---

### "File too large"

**Symptom:** Upload fails for large images

**Solutions:**

1. **Increase Nginx Limit**
   ```nginx
   # In /etc/nginx/nginx.conf
   client_max_body_size 10M;
   ```

2. **Compress Images**
   - Use image compression before upload
   - Recommended: TinyPNG, Squoosh

3. **Frontend Validation**
   ```javascript
   const MAX_SIZE = 5 * 1024 * 1024; // 5MB
   
   if (file.size > MAX_SIZE) {
     alert('File too large. Max 5MB per image.');
   }
   ```

---

### S3 Upload Fails

**Symptom:** "Failed to upload to S3"

**Checks:**

1. **AWS Credentials**
   ```bash
   # Verify credentials in .env
   grep AWS backend/.env
   ```

2. **IAM Permissions**
   - User needs s3:PutObject permission
   - Check bucket policy

3. **Bucket Region**
   ```javascript
   // Ensure AWS_REGION matches bucket region
   ```

4. **Fallback to Local**
   ```javascript
   // multerS3.js should fallback to local storage if S3 fails
   ```

---

## Chatbot Issues

### Chatbot Not Responding

**Symptom:** Loading indefinitely or error message

**Checks:**

1. **Claude API Key**
   ```bash
   # Verify key is set
   grep CLAUDE_API_KEY backend/.env
   ```

2. **API Key Valid**
   - Check if key is active in Anthropic console
   - Verify billing/credits

3. **Rate Limiting**
   - Claude API has rate limits
   - Implement exponential backoff

4. **Network Issues**
   ```bash
   # Test API connectivity
   curl https://api.anthropic.com
   ```

**Solution:**
```javascript
// Add timeout to chatbot requests
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

fetch('/api/chatbot/chat', {
  signal: controller.signal,
  // ... other options
});
```

---

### Chatbot Returns Generic Responses

**Symptom:** No car recommendations or irrelevant answers

**Checks:**

1. **Car Context**
   - Verify `/api/chatbot/available-cars` returns data
   ```bash
   curl http://localhost:4000/api/chatbot/available-cars
   ```

2. **System Prompt**
   - Check chatbotController.js has correct prompt
   - Ensure car data is included in context

3. **Conversation History**
   - Verify history is sent from frontend
   - Check format matches Claude expectations

---

## Deployment Problems

### Can't SSH to EC2

**Symptom:** "Permission denied" or connection timeout

**Solutions:**

1. **Key Permissions**
   ```bash
   chmod 400 your-key.pem
   ```

2. **Security Group**
   - Add your IP to SSH inbound rules
   - Port 22 must be open

3. **Correct User**
   ```bash
   # For Ubuntu
   ssh -i key.pem ubuntu@ec2-ip
   
   # Not root@
   ```

---

### SSL Certificate Fails

**Symptom:** Certbot errors or HTTPS not working

**Solutions:**

1. **DNS Not Propagated**
   ```bash
   # Check DNS
   nslookup your-domain.com
   ```

2. **Port 80/443 Not Open**
   ```bash
   sudo ufw status
   sudo ufw allow 'Nginx Full'
   ```

3. **Certbot Rate Limit**
   - Let's Encrypt has rate limits
   - Wait or use staging environment

4. **Manual Renewal**
   ```bash
   sudo certbot renew --dry-run
   sudo certbot renew
   ```

---

### Changes Not Reflecting After Deploy

**Symptom:** Updated code doesn't show in production

**Checks:**

1. **Backend Not Restarted**
   ```bash
   pm2 restart all
   ```

2. **Frontend Not Rebuilt**
   ```bash
   cd frontend
   npm run build
   sudo cp -r build/* /var/www/html/
   ```

3. **Browser Cache**
   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache

4. **CDN Cache** (if using)
   - Invalidate CloudFront cache
   - Or wait for TTL expiry

---

## Performance Issues

### Slow Page Load

**Solutions:**

1. **Enable Gzip**
   ```nginx
   # Already in nginx.conf
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Optimize Images**
   - Compress images before upload
   - Use appropriate image sizes

3. **Code Splitting**
   ```javascript
   // Lazy load routes
   const Shop = lazy(() => import('./Pages/Shop'));
   ```

4. **Database Queries**
   - Add indexes
   - Use pagination
   - Limit fields returned

---

### High Memory Usage

**Checks:**

```bash
# Check memory
free -m

# Check PM2
pm2 monit

# Check process
top
```

**Solutions:**

1. **Increase Server Resources**
   - Upgrade EC2 instance

2. **PM2 Cluster Mode**
   ```javascript
   // ecosystem.config.js
   instances: 'max',
   exec_mode: 'cluster'
   ```

3. **Memory Leaks**
   - Use Node.js profiler
   - Check for unclosed connections
   - Clear unused variables

---

## Error Reference

### Backend Error Codes

| Error | Code | Cause | Solution |
|-------|------|-------|----------|
| Request is not authorized | 401 | No/invalid token | Login again, check token |
| User is not authorized... | 403 | Not admin | Verify admin role |
| No such car | 404 | Car ID not found | Check ID, car may be deleted |
| All fields required | 400 | Missing data | Verify all fields sent |
| Email already in use | 400 | Duplicate email | Use different email |
| Incorrect password | 400 | Wrong password | Check credentials |
| Password too weak | 400 | Weak password | Use stronger password |
| Invalid car ID | 400 | Bad ObjectId | Verify ID format |

### HTTP Status Codes

- **200 OK**: Success
- **201 Created**: Resource created
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error
- **502 Bad Gateway**: Backend unreachable
- **504 Gateway Timeout**: Request timeout

---

## Getting Help

### Log Collection

When asking for help, provide:

1. **Error Message**
2. **Relevant Logs**
   ```bash
   pm2 logs --lines 100 > backend-logs.txt
   sudo tail -100 /var/log/nginx/error.log > nginx-logs.txt
   ```
3. **Environment Info**
   - OS version
   - Node version
   - Package versions
4. **Steps to Reproduce**

### Support Channels

- **GitHub Issues**: Bug reports
- **Email**: support@example.com
- **Documentation**: Check all docs/ files

---

**Last Updated:** December 20, 2025  
**Version:** 1.0
