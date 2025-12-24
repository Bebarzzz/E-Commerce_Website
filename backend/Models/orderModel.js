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

orderSchema.statics.getOrderById = async function(orderId) {
    const order = await this.findById(orderId).populate('items.carId');
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
}

orderSchema.statics.updateOrderStatus = async function(orderId, newStatus) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid order status');
    }
    
    const order = await this.findByIdAndUpdate(
        orderId,
        { orderStatus: newStatus },
        { new: true, runValidators: true }
    );
    
    if (!order) {
        throw new Error('Order not found');
    }
    
    return order;
}

orderSchema.statics.getUserOrders = async function(userId) {
    const orders = await this.find({ userID: userId }).sort({ createdAt: -1 });
    return orders;
}

orderSchema.statics.filterOrders = async function(filters) {
    const query = {};
    
    if (filters.status) {
        query.orderStatus = filters.status;
    }
    
    if (filters.userId) {
        query.userID = filters.userId;
    }
    
    if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
            query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            query.createdAt.$lte = new Date(filters.endDate);
        }
    }
    
    const orders = await this.find(query).sort({ createdAt: -1 });
    return orders;
}

module.exports = mongoose.model('Order', orderSchema);
