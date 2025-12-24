const Car = require('../Models/carModel')
const mongoose = require('mongoose')

const removeCar = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Car.removeCar(id);

        if (result.success) {
            res.status(200).json({ message: result.message, deletedCar: result.deletedCar });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getSingleCar = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid car ID format.' });
        }

        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({ error: 'Car not found.' });
        }

        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addCar = async (req, res) => {
    const { model, manufactureYear, brand, type, price, engineCapacity, wheelDriveType, engineType, transmissionType, condition, description } = req.body;

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
            description || '',
            images
        );

        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const editCar = async (req, res) => {
    const { id } = req.params;
    const { model, manufactureYear, brand, type, price, engineCapacity, wheelDriveType, engineType, transmissionType, condition, description } = req.body;

    try {
        const updateData = { 
            model, 
            brand, 
            type, 
            wheelDriveType, 
            engineType, 
            transmissionType, 
            condition 
        };
        
        // Add description if provided
        if (description !== undefined) {
            updateData.description = description;
        }
        
        // Parse numeric fields (FormData sends everything as strings)
        if (manufactureYear !== undefined) {
            updateData.manufactureYear = parseInt(manufactureYear);
        }
        if (price !== undefined) {
            updateData.price = parseFloat(price);
        }
        if (engineCapacity !== undefined) {
            updateData.engineCapacity = parseFloat(engineCapacity);
        }
        
        // Add new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.location);
            updateData.images = newImages;
        }
        
        const result = await Car.editCar(id, updateData);

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

const searchCars = async (req, res) => {
    const { query } = req.query;

    try {
        // If no query provided, return 3 most recent cars
        if (!query || query.trim() === '') {
            const cars = await Car.find({}).sort({ createdAt: -1 }).limit(3);
            return res.status(200).json(cars);
        }

        // Create a case-insensitive regex pattern for matching
        const searchPattern = new RegExp(query, 'i');

        // Search across multiple fields
        const cars = await Car.find({
            $or: [
                { model: searchPattern },
                { brand: searchPattern },
                { type: searchPattern },
                { engineType: searchPattern },
                { transmissionType: searchPattern },
                { wheelDriveType: searchPattern },
                { condition: searchPattern }
            ]
        }).sort({ createdAt: -1 }).limit(3);

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
    searchCars,
    getSingleCar
};