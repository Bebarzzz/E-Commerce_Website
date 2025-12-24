// import dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
require('dotenv').config()

// Set default environment variables if not set
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
process.env.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
process.env.PORT = process.env.PORT || 4000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//import files 
const chatbotRoutes = require('./controllers/chatbot')
const userRoutes = require('./routes/user')
const carRoutes = require('./routes/car')
const orderRoutes = require('./routes/order')
const contactRoutes = require('./routes/contact')
const adminRoutes = require('./routes/admin')



// express app
const app = express()


// middleware
app.use(express.json())

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// routes
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/user', userRoutes)
app.use('/api/car', carRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)


// Migration function to drop incorrect index
async function runMigrations() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'orders' }).toArray();
    
    if (collections.length > 0) {
      const indexes = await db.collection('orders').indexes();
      const problematicIndex = indexes.find(idx => idx.name === 'RreciptURL_1');
      
      if (problematicIndex) {
        console.log('Found problematic index "RreciptURL_1", dropping it...');
        await db.collection('orders').dropIndex('RreciptURL_1');
        console.log('Successfully dropped problematic index "RreciptURL_1"');
      } else {
        console.log('No problematic index found - database is clean');
      }
    }
  } catch (error) {
    console.error('Migration error:', error.message);
    // Don't fail server startup if migration fails
  }
}

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('connected to database')
    
    // Run migrations
    await runMigrations();
    
    // listen to port
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection error:', err.message)
    console.log('Starting server without database connection for testing purposes...')
    // listen to port even without database
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} (without database)`)
    })
  })

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  mongoose.connection.close()
  process.exit(0)
}) 
