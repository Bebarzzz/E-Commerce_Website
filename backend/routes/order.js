const express = require('express')
const {
    showOrders,
    createOrder,
} = require('../controllers/orderController')

const router = express.Router()


router.get('/showallorders', showOrders)
router.post('/', createOrder)

module.exports = router