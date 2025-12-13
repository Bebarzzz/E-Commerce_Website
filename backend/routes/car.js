const express = require('express')
const { requireAuth, requireAdmin } = require('../middleware/requireAuth')
const upload = require('../config/multerS3')
const {
    addCar,
    removeCar,
    editCar,
    getAllCars
} = require('../controllers/carController')

const router = express.Router()

router.get('/', getAllCars)

// Allow up to 5 images per car
router.post('/', requireAuth, requireAdmin, upload.array('images', 5), addCar)
router.patch('/:id', requireAuth, requireAdmin, upload.array('images', 5), editCar)
router.delete('/:id', requireAuth, requireAdmin, removeCar)

module.exports = router