const express = require('express');
const { chatWithBot, getAvailableCars, clearHistory } = require('../controllers/chatbotController');

const router = express.Router();

// POST /api/chatbot/chat - Chat with the AI assistant
router.post('/chat', chatWithBot);

// GET /api/chatbot/cars - Get available cars
router.get('/cars', getAvailableCars);

// POST /api/chatbot/clear - Clear conversation history
router.post('/clear', clearHistory);

module.exports = router;
