const express = require('express');
const {
    createContact,
    getAllContacts,
    updateContactStatus
} = require('../controllers/contactController');
const { requireAuth, requireAdmin } = require('../middleware/requireAuth');

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', createContact);

// Protected admin routes - view and manage contact messages
router.get('/', requireAuth, requireAdmin, getAllContacts);
router.patch('/:id/status', requireAuth, requireAdmin, updateContactStatus);

module.exports = router;
