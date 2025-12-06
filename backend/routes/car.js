const express = require('express')
const { requireAuth, requireAdmin } = require('../middleware/requireAuth')
const {
    addCar,
    removeCar,
    editCar
} = require('../controllers/carController')

const router = express.Router()


router.post('/add', addCar)
router.delete('/remove', removeCar)
router.patch('/edit', editCar)

module.exports = router