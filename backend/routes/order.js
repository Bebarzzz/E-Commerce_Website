const express = require('express')
const {
    showOrders,
} = require('../controllers/orderController')

const router = express.Router()


router.get('/showallorders', showOrders)

module.exports = router