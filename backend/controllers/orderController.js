const orderModel = require('../Models/orderModel');


const showOrders = async (req, res) => {
    try {
        const orders = await orderModel.showOrders();
        res.status(200).json({
            success: true,
            orders: orders
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        
        // Get userID from authenticated user if available
        const userID = req.user ? req.user._id : null;
        
        const order = await orderModel.createOrder({
            items,
            totalAmount,
            shippingAddress,
            userID
        });
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: order
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

module.exports = {
    showOrders,
    createOrder,
};