const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')
const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findOne({ _id }).select('_id role')
        next()
    }
    catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Request is not authorized' })
    }

}

// Verify user has admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' })
    }
    next()
}

module.exports = { requireAuth, requireAdmin }