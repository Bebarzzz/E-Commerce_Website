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

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);
        
        // If user is not admin, verify they own this order
        if (req.user.role !== 'admin' && order.userID && order.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }
        
        res.status(200).json({
            success: true,
            order: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }
        
        const order = await orderModel.updateOrderStatus(id, status);
        
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await orderModel.getUserOrders(userId);
        
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

module.exports = {
    showOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    getUserOrders
};