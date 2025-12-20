const express = require('express');
const { chatWithBot, getAvailableCars } = require('../controllers/chatbotController');

const router = express.Router();

// POST /api/chatbot/chat - Chat with the bot
router.post('/chat', chatWithBot);

// GET /api/chatbot/cars - Get available cars for context
router.get('/cars', getAvailableCars);

module.exports = router;