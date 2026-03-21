const pool = require('../config/database');

// Account (Chart of Accounts) Model
const Account = {
  async createAccount(userId, name, type, code, description, balance = 0) {
    const query = `
      INSERT INTO accounts (user_id, name, type, code, description, balance)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, name, type, code, description, balance, created_at;
    `;
    const result = await pool.query(query, [userId, name, type, code, description, balance]);
    return result.rows[0];
  },

  async getAccountById(accountId, userId) {
    const query = `
      SELECT * FROM accounts 
      WHERE id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [accountId, userId]);
    return result.rows[0];
  },

  async getAccountsByUser(userId) {
    const query = `
      SELECT * FROM accounts 
      WHERE user_id = $1 
      ORDER BY code ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async getAccountsByType(userId, type) {
    const query = `
      SELECT * FROM accounts 
      WHERE user_id = $1 AND type = $2
      ORDER BY code ASC
    `;
    const result = await pool.query(query, [userId, type]);
    return result.rows;
  },

  async updateAccountBalance(accountId, newBalance) {
    const query = `
      UPDATE accounts 
      SET balance = $2 
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [accountId, newBalance]);
    return result.rows[0];
  },

  async updateAccount(accountId, userId, data) {
    const { name, description } = data;
    const query = `
      UPDATE accounts 
      SET name = COALESCE($3, name),
          description = COALESCE($4, description)
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [accountId, userId, name, description]);
    return result.rows[0];
  },

  async deleteAccount(accountId, userId) {
    const query = `
      DELETE FROM accounts 
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const result = await pool.query(query, [accountId, userId]);
    return result.rows[0];
  },
};

module.exports = Account;
