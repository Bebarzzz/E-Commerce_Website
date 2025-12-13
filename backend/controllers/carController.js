const Car = require('../Models/carModel')


const removeCar = async (req, res) => {
    const { carId } = req.body;

    try {
        const result = await Car.removeCar(carId);

        if (result.success) {
            res.status(200).json({ message: result.message, deletedCar: result.deletedCar });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addCar = async (req, res) => {
    const { model, manufactureYear, brand, type, price, engineCapacity, wheelDriveType, engineType, transmissionType, condition } = req.body;

    try {
        // Get image URLs from uploaded files
        const images = req.files ? req.files.map(file => file.location) : [];

        const car = await Car.addNewCar(
            model, 
            parseInt(manufactureYear), 
            brand, 
            type, 
            parseFloat(price),
            parseFloat(engineCapacity),
            wheelDriveType,
            engineType,
            transmissionType,
            condition,
            images
        );

        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const editCar = async (req, res) => {
    const { carId, model, manufactureYear, brand, type, price, engineCapacity, wheelDriveType, engineType, transmissionType, condition } = req.body;

    try {
        const updateData = { model, manufactureYear, brand, type, price, engineCapacity, wheelDriveType, engineType, transmissionType, condition };
        
        // Add new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.location);
            updateData.images = newImages;
        }
        
        const result = await Car.editCar(carId, updateData);

        if (result.success) {
            res.status(200).json({ message: result.message, updatedCar: result.updatedCar });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({}).sort({ createdAt: -1 });
        res.status(200).json(cars);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addCar,
    removeCar,
    editCar,
    getAllCars,
};