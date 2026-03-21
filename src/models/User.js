const pool = require('../config/database');

// User Model
const User = {
  async createUser(email, passwordHash, fullName) {
    const query = `
      INSERT INTO users (email, password_hash, full_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, full_name, created_at;
    `;
    const result = await pool.query(query, [email, passwordHash, fullName]);
    return result.rows[0];
  },

  async getUserById(userId) {
    const query = 'SELECT id, email, full_name, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async getAllUsers() {
    const query = 'SELECT id, email, full_name, created_at FROM users';
    const result = await pool.query(query);
    return result.rows;
  },

  async updateUser(userId, data) {
    const { fullName, email } = data;
    const query = `
      UPDATE users 
      SET full_name = COALESCE($2, full_name),
          email = COALESCE($3, email)
      WHERE id = $1
      RETURNING id, email, full_name, created_at;
    `;
    const result = await pool.query(query, [userId, fullName, email]);
    return result.rows[0];
  },

  async deleteUser(userId) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  },
};

module.exports = User;
