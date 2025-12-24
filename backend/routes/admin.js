const express = require('express');
const {
    getDashboardStats,
    getSalesStats,
    getInventoryStats,
    getRecentActivity
} = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/requireAuth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth, requireAdmin);

// Dashboard statistics
router.get('/stats/overview', getDashboardStats);
router.get('/stats/sales', getSalesStats);
router.get('/stats/inventory', getInventoryStats);
router.get('/stats/recent-activity', getRecentActivity);

module.exports = router;
