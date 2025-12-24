const User = require('../Models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')



const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)
        res.status(200).json({username: user.username, email, role: user.role, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }


}



// signup user
const signupUser = async (req, res) => {
    const {username, email, password, role} = req.body

    try {
        const user = await User.signup(username, email, password, role)

        // create a token
        const token = createToken(user._id)


        res.status(200).json({username, email, role: user.role, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }



    
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.getProfile(userId);
        
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, email } = req.body;
        
        const user = await User.updateProfile(userId, { username, email });
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;
        
        await User.changePassword(userId, currentPassword, newPassword);
        
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// Verify token and return user info (prevents frontend bypass)
const verifyToken = async (req, res) => {
    try {
        // req.user is set by requireAuth middleware after validating JWT
        const user = req.user;
        
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token verification failed'
        });
    }
}


module.exports = {
    loginUser,
    signupUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    verifyToken
}