const orderModel = require('../Models/orderModel');
const jwt = require('jsonwebtoken');


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
        
        // Try to get userID from JWT token if available
        let userID = null;
        const { authorization } = req.headers;
        
        if (authorization) {
            try {
                const token = authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userID = decoded._id;
            } catch (error) {
                console.log('Token verification failed, proceeding without userID:', error.message);
            }
        }
        
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