// import dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
require('dotenv').config()

//import files 
const userRoutes = require('./routes/user')
const carRoutes = require('./routes/car')
const orderRoutes = require('./routes/order')



// express app
const app = express()


// middleware
app.use(express.json())

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
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
  credentials: true
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
app.use('/api/user', userRoutes)
app.use('/api/car', carRoutes)
app.use('/api/order', orderRoutes)


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection error:', err)
    process.exit(1)
  })

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  mongoose.connection.close()
  process.exit(0)
}) 
