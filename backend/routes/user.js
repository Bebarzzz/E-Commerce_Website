const express = require('express')
const {
    loginUser,
    signupUser
} = require('../controllers/userController')

const router = express.Router()


// login user
router.post('/login', loginUser)

// signup user
router.post('/signup', signupUser)

module.exports = router