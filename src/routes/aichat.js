const express = require('express');
const AIChatController = require('../controllers/AIChatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/message', AIChatController.sendMessage);
router.get('/history', AIChatController.getChatHistory);
router.delete('/history', AIChatController.clearChat);
router.post('/suggestion', AIChatController.saveSuggestion);
router.get('/suggestions', AIChatController.getSuggestions);

module.exports = router;
