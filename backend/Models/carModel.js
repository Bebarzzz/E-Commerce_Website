const mongoose = require('mongoose')


const Schema = mongoose.Schema


const carSchema = new Schema({
    model: {
        type: String,
        required: true,
        unique: false,
    },
    manufactureYear: {
        type: Number,
        required: true,
        unique: false,
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    
}, { timestamps: true 

})

carSchema.statics.addNewCar = async function(model, manufactureYear, brand, type, price) {


    if (!model || !brand || !type || !price || !manufactureYear) {
        throw new Error('All fields (model, manufactureYear, brand, type, price) are required.')
    }

    if (typeof price !== 'number' || price <= 0) {
        throw new Error('Price must be a positive number.')
    }
    
    const currentYear = new Date().getFullYear();
    if (typeof manufactureYear !== 'number' || manufactureYear > currentYear || manufactureYear < 1900) {
        throw new Error(`Manufacture year must be a valid year between 1900 and ${currentYear}.`)
    }

    const car = await this.create({ model, manufactureYear, brand, type, price })

    return car
}



carSchema.statics.removeCar = async function(carId) {

    if (!carId) {
        throw new Error('A car ID is required for deletion.');
    }
    

    if (!mongoose.Types.ObjectId.isValid(carId)) {
        throw new Error('Invalid car ID format.');
    }

 
    const result = await this.findByIdAndDelete(carId);


    if (!result) {

        return { success: false, message: `Car with ID ${carId} not found.` };
    }

    
    return { success: true, deletedCar: result, message: 'Car successfully deleted.' };
}


module.exports = mongoose.model('Car', carSchema)