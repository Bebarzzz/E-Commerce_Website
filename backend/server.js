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



// express app
const app = express()


// middleware
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/car', carRoutes)




// connect to db
mongoose.connect("mongodb+srv://shalabox:123@ecommercewebsitedb.kplwrja.mongodb.net/ecommerce?appName=ECommerceWebsiteDB")
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(4000, () => {
      console.log('listening for requests on port', 4000)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 


