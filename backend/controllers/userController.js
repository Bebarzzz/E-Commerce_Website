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



module.exports = {
    loginUser,
    signupUser,
}