const AIChat = require('../models/AIChat');

const AIChatController = {
  async sendMessage(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Save user message
      const userMsg = await AIChat.saveMessage(req.userId, 'user', message);

      // TODO: Integrate with AI service (OpenAI, etc.)
      // For now, return a placeholder response

      const aiResponse = `AI Response to: "${message.substring(0, 50)}..."`;
      const aiMsg = await AIChat.saveMessage(req.userId, 'assistant', aiResponse);

      res.json({
        message: 'Message processed',
        userMessage: userMsg,
        aiMessage: aiMsg,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getChatHistory(req, res) {
    try {
      const { limit = 100 } = req.query;

      const messages = await AIChat.getChatHistory(req.userId, parseInt(limit));

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async clearChat(req, res) {
    try {
      await AIChat.clearChatHistory(req.userId);

      res.json({ message: 'Chat history cleared' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async saveSuggestion(req, res) {
    try {
      const { entryId, field, suggestedValue, reason } = req.body;

      if (!entryId || !field || !suggestedValue) {
        return res.status(400).json({ error: 'Entry ID, field, and suggested value are required' });
      }

      const suggestion = await AIChat.saveSuggestion(req.userId, entryId, field, suggestedValue, reason);

      res.status(201).json({
        message: 'Suggestion saved',
        suggestion,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSuggestions(req, res) {
    try {
      const { entryId, limit = 50 } = req.query;

      const suggestions = await AIChat.getSuggestions(req.userId, entryId, parseInt(limit));

      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = AIChatController;
