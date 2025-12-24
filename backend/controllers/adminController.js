const Order = require('../Models/orderModel');
const Car = require('../Models/carModel');
const User = require('../Models/userModel');

// Get dashboard overview statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalCars = await Car.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        
        // Get order status counts
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get recent orders (last 5)
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderStatus totalAmount createdAt shippingAddress');
        
        res.status(200).json({
            success: true,
            stats: {
                totalCars,
                totalOrders,
                totalUsers,
                totalRevenue,
                ordersByStatus,
                recentOrders
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get sales statistics
const getSalesStats = async (req, res) => {
    try {
        const { startDate, endDate, period = 'daily' } = req.query;
        
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }
        
        // Group by period
        let groupBy;
        switch (period) {
            case 'monthly':
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                };
                break;
            case 'weekly':
                groupBy = {
                    year: { $year: '$createdAt' },
                    week: { $week: '$createdAt' }
                };
                break;
            default: // daily
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
        }
        
        const salesByPeriod = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
        ]);
        
        res.status(200).json({
            success: true,
            salesData: salesByPeriod
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get inventory statistics
const getInventoryStats = async (req, res) => {
    try {
        // Get cars by type
        const carsByType = await Car.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get cars by condition
        const carsByCondition = await Car.aggregate([
            {
                $group: {
                    _id: '$condition',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get cars by brand
        const carsByBrand = await Car.aggregate([
            {
                $group: {
                    _id: '$brand',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        // Get average price by type
        const avgPriceByType = await Car.aggregate([
            {
                $group: {
                    _id: '$type',
                    averagePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            inventoryStats: {
                carsByType,
                carsByCondition,
                carsByBrand,
                avgPriceByType
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('items.carId', 'brand model')
            .select('orderStatus totalAmount createdAt shippingAddress');
        
        res.status(200).json({
            success: true,
            recentActivity: recentOrders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getSalesStats,
    getInventoryStats,
    getRecentActivity
};
