const mongoose = require('mongoose')


const Schema = mongoose.Schema


const orderSchema = new Schema({
    userID: {
        type: Number,
        required: true,
        unique: false,
    },
    orderStatus: {
        type: String,
        required: true,
        unique: false,
    },
    carId: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    RreciptURL: {
        type: String,
        required: true,
        unique: true,
    }
    
}, { timestamps: true 

})
orderSchema.statics.showOrders = async function() {
    const orders = await this.find({}).sort({ createdAt: -1 });
    return orders;
}





module.exports = mongoose.model('Order', orderSchema);
