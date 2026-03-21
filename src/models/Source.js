const pool = require('../config/database');

// Source Model (Bank/Cash Source connections)
const Source = {
  async createSource(userId, name, type, connectionDetails, isActive = true) {
    const query = `
      INSERT INTO sources (user_id, name, type, connection_details, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, name, type, is_active, created_at;
    `;
    const result = await pool.query(query, [userId, name, type, JSON.stringify(connectionDetails), isActive]);
    return result.rows[0];
  },

  async getSourceById(sourceId, userId) {
    const query = `
      SELECT * FROM sources 
      WHERE id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [sourceId, userId]);
    return result.rows[0];
  },

  async getSourcesByUser(userId) {
    const query = `
      SELECT id, user_id, name, type, is_active, created_at FROM sources 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async updateSource(sourceId, userId, data) {
    const { name, isActive, connectionDetails } = data;
    const query = `
      UPDATE sources 
      SET name = COALESCE($3, name),
          is_active = COALESCE($4, is_active),
          connection_details = COALESCE($5, connection_details)
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, name, type, is_active, created_at;
    `;
    const result = await pool.query(query, [
      sourceId,
      userId,
      name,
      isActive,
      connectionDetails ? JSON.stringify(connectionDetails) : null,
    ]);
    return result.rows[0];
  },

  async deleteSource(sourceId, userId) {
    const query = `
      DELETE FROM sources 
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const result = await pool.query(query, [sourceId, userId]);
    return result.rows[0];
  },
};

module.exports = Source;
