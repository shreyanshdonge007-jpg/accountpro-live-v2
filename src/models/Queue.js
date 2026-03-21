const pool = require('../config/database');

// Queue Model (Auto-Post Queue)
const Queue = {
  async addToQueue(userId, sourceId, transactionData, status = 'pending') {
    const query = `
      INSERT INTO queue (user_id, source_id, transaction_data, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, source_id, status, created_at;
    `;
    const result = await pool.query(query, [userId, sourceId, JSON.stringify(transactionData), status]);
    return result.rows[0];
  },

  async getQueueItems(userId, status = null, limit = 50, offset = 0) {
    let query = `
      SELECT * FROM queue 
      WHERE user_id = $1
    `;
    const params = [userId];

    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  async updateQueueStatus(queueId, userId, status) {
    const query = `
      UPDATE queue 
      SET status = $3 
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [queueId, userId, status]);
    return result.rows[0];
  },

  async processQueueItem(queueId, userId, entryId) {
    const query = `
      UPDATE queue 
      SET status = 'completed', entry_id = $3, processed_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [queueId, userId, entryId]);
    return result.rows[0];
  },

  async deleteQueueItem(queueId, userId) {
    const query = `
      DELETE FROM queue 
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const result = await pool.query(query, [queueId, userId]);
    return result.rows[0];
  },
};

module.exports = Queue;
