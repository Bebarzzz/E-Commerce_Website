const express = require('express')
const { requireAuth, requireAdmin } = require('../middleware/requireAuth')
const {
    addCar,
    removeCar,
    editCar,
    getAllCars
} = require('../controllers/carController')

const router = express.Router()

router.get('/', getAllCars)

router.post('/', requireAuth, requireAdmin, addCar)
router.patch('/:id', requireAuth, requireAdmin, editCar)
router.delete('/:id', requireAuth, requireAdmin, removeCar)

module.exports = router