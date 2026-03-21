const pool = require('../config/database');

// Journal Entry Model
const JournalEntry = {
  async createEntry(userId, entryDate, description, lines) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert journal entry
      const entryQuery = `
        INSERT INTO journal_entries (user_id, entry_date, description)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, entry_date, description, created_at;
      `;
      const entryResult = await client.query(entryQuery, [userId, entryDate, description]);
      const entryId = entryResult.rows[0].id;

      // Insert entry lines
      const lineQuery = `
        INSERT INTO entry_lines (entry_id, account_id, debit, credit, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const insertedLines = [];
      for (const line of lines) {
        const lineResult = await client.query(lineQuery, [
          entryId,
          line.accountId,
          line.debit || 0,
          line.credit || 0,
          line.description || '',
        ]);
        insertedLines.push(lineResult.rows[0]);

        // Update account balance
        const balanceQuery = `
          UPDATE accounts 
          SET balance = balance + COALESCE($2, 0) - COALESCE($3, 0)
          WHERE id = $1;
        `;
        await client.query(balanceQuery, [line.accountId, line.debit, line.credit]);
      }

      await client.query('COMMIT');

      return {
        entry: entryResult.rows[0],
        lines: insertedLines,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getEntryById(entryId, userId) {
    const query = `
      SELECT je.*, array_agg(json_build_object(
        'id', el.id,
        'account_id', el.account_id,
        'debit', el.debit,
        'credit', el.credit,
        'description', el.description
      )) as lines
      FROM journal_entries je
      LEFT JOIN entry_lines el ON je.id = el.entry_id
      WHERE je.id = $1 AND je.user_id = $2
      GROUP BY je.id;
    `;
    const result = await pool.query(query, [entryId, userId]);
    return result.rows[0];
  },

  async getEntriesByUser(userId, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM journal_entries 
      WHERE user_id = $1
      ORDER BY entry_date DESC, created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  },

  async getEntriesByDateRange(userId, startDate, endDate) {
    const query = `
      SELECT * FROM journal_entries 
      WHERE user_id = $1 AND entry_date >= $2 AND entry_date <= $3
      ORDER BY entry_date DESC;
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  },

  async updateEntry(entryId, userId, data) {
    const { description } = data;
    const query = `
      UPDATE journal_entries 
      SET description = COALESCE($3, description)
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [entryId, userId, description]);
    return result.rows[0];
  },

  async deleteEntry(entryId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get the entry lines first
      const linesQuery = 'SELECT * FROM entry_lines WHERE entry_id = $1';
      const linesResult = await client.query(linesQuery, [entryId]);

      // Reverse the balance updates
      for (const line of linesResult.rows) {
        const balanceQuery = `
          UPDATE accounts 
          SET balance = balance - COALESCE($2, 0) + COALESCE($3, 0)
          WHERE id = $1;
        `;
        await client.query(balanceQuery, [line.account_id, line.debit, line.credit]);
      }

      // Delete entry lines
      await client.query('DELETE FROM entry_lines WHERE entry_id = $1', [entryId]);

      // Delete journal entry
      const deleteQuery = `
        DELETE FROM journal_entries 
        WHERE id = $1 AND user_id = $2
        RETURNING id;
      `;
      const result = await client.query(deleteQuery, [entryId, userId]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = JournalEntry;
