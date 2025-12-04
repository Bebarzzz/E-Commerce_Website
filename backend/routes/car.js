const express = require('express')
const {
    addCar,
    removeCar
} = require('../controllers/carController')

const router = express.Router()


router.post('/add', addCar)
router.delete('/remove', removeCar)

module.exports = router