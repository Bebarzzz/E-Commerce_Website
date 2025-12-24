const express = require('express')
const {
    showOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    getUserOrders
} = require('../controllers/orderController')
const { requireAuth, requireAdmin } = require('../middleware/requireAuth')

const router = express.Router()

// Public route - create order (guest or authenticated)
router.post('/', createOrder)

// Protected routes - require authentication
router.get('/user', requireAuth, getUserOrders)
router.get('/showallorders', requireAuth, requireAdmin, showOrders)
router.get('/:id', requireAuth, getOrderById)
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus)

module.exports = router