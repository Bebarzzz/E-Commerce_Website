const express = require('express')
const {
    loginUser,
    signupUser,
    getUserProfile,
    updateUserProfile,
    changePassword
} = require('../controllers/userController')
const { requireAuth } = require('../middleware/requireAuth')

const router = express.Router()


// Public routes
router.post('/login', loginUser)
router.post('/signup', signupUser)

// Protected routes - require authentication
router.get('/profile', requireAuth, getUserProfile)
router.patch('/profile', requireAuth, updateUserProfile)
router.patch('/password', requireAuth, changePassword)

module.exports = router