const pool = require('../config/database');

// AI Chat Model
const AIChat = {
  async saveMessage(userId, role, content) {
    const query = `
      INSERT INTO ai_chat (user_id, role, content)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, role, content, created_at;
    `;
    const result = await pool.query(query, [userId, role, content]);
    return result.rows[0];
  },

  async getChatHistory(userId, limit = 100) {
    const query = `
      SELECT * FROM ai_chat 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows.reverse(); // Return in ascending order for chat display
  },

  async clearChatHistory(userId) {
    const query = `
      DELETE FROM ai_chat 
      WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);
  },

  async saveSuggestion(userId, entryId, field, suggestedValue, reason) {
    const query = `
      INSERT INTO ai_suggestions (user_id, entry_id, field, suggested_value, reason)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, entry_id, field, suggested_value, reason, created_at;
    `;
    const result = await pool.query(query, [userId, entryId, field, suggestedValue, reason]);
    return result.rows[0];
  },

  async getSuggestions(userId, entryId = null, limit = 50) {
    let query = `
      SELECT * FROM ai_suggestions 
      WHERE user_id = $1
    `;
    const params = [userId];

    if (entryId) {
      query += ` AND entry_id = $2`;
      params.push(entryId);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  },
};

module.exports = AIChat;
