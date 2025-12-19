const mongoose = require('mongoose')


const Schema = mongoose.Schema


const orderSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        required: true,
    },
    items: [{
        carId: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        image: {
            type: String,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    receiptURL: {
        type: String,
        required: false,
    }
    
}, { timestamps: true 

})
orderSchema.statics.showOrders = async function() {
    const orders = await this.find({}).sort({ createdAt: -1 });
    return orders;
}

orderSchema.statics.createOrder = async function(orderData) {
    const { items, totalAmount, shippingAddress, userID } = orderData;
    
    // Validate required fields
    if (!items || items.length === 0) {
        throw new Error('Order must contain at least one item');
    }
    if (!totalAmount) {
        throw new Error('Total amount is required');
    }
    if (!shippingAddress) {
        throw new Error('Shipping address is required');
    }
    
    // Create the order
    const order = await this.create({
        userID,
        items,
        totalAmount,
        shippingAddress,
        orderStatus: 'pending'
    });
    
    return order;
}

module.exports = mongoose.model('Order', orderSchema);
