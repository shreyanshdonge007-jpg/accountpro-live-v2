const pool = require('../config/database');

const ReportController = {
  async getTrialBalance(req, res) {
    try {
      const query = `
        SELECT 
          a.code,
          a.name,
          a.type,
          a.balance,
          CASE 
            WHEN a.type IN ('Asset', 'Expense') THEN a.balance
            ELSE -a.balance
          END as debit,
          CASE 
            WHEN a.type IN ('Asset', 'Expense') THEN -a.balance
            ELSE a.balance
          END as credit
        FROM accounts a
        WHERE a.user_id = $1 AND a.balance != 0
        ORDER BY a.code;
      `;

      const result = await pool.query(query, [req.userId]);

      const totalDebit = result.rows.reduce((sum, row) => sum + (row.debit || 0), 0);
      const totalCredit = result.rows.reduce((sum, row) => sum + (row.credit || 0), 0);

      res.json({
        report: 'Trial Balance',
        date: new Date(),
        accounts: result.rows,
        summary: {
          totalDebit: parseFloat(totalDebit.toFixed(2)),
          totalCredit: parseFloat(totalCredit.toFixed(2)),
          balanced: Math.abs(totalDebit - totalCredit) < 0.01,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getIncomeStatement(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const query = `
        SELECT 
          a.code,
          a.name,
          a.type,
          COALESCE(SUM(CASE WHEN el.debit > 0 THEN el.debit ELSE -el.credit END), 0) as amount
        FROM accounts a
        LEFT JOIN entry_lines el ON a.id = el.account_id
        LEFT JOIN journal_entries je ON el.entry_id = je.id
        WHERE a.user_id = $1 
          AND a.type IN ('Revenue', 'Expense')
          AND (je.entry_date IS NULL OR (je.entry_date >= $2 AND je.entry_date <= $3))
        GROUP BY a.id, a.code, a.name, a.type
        ORDER BY a.type DESC, a.code;
      `;

      const result = await pool.query(query, [req.userId, startDate, endDate]);

      const revenues = result.rows.filter(r => r.type === 'Revenue').reduce((sum, r) => sum + (r.amount || 0), 0);
      const expenses = result.rows.filter(r => r.type === 'Expense').reduce((sum, r) => sum + (r.amount || 0), 0);

      res.json({
        report: 'Income Statement',
        period: { startDate, endDate },
        items: result.rows,
        summary: {
          totalRevenue: parseFloat(revenues.toFixed(2)),
          totalExpense: parseFloat(expenses.toFixed(2)),
          netIncome: parseFloat((revenues - expenses).toFixed(2)),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getBalanceSheet(req, res) {
    try {
      const query = `
        SELECT 
          a.code,
          a.name,
          a.type,
          a.balance
        FROM accounts a
        WHERE a.user_id = $1 
          AND a.type IN ('Asset', 'Liability', 'Equity')
        ORDER BY 
          CASE a.type
            WHEN 'Asset' THEN 1
            WHEN 'Liability' THEN 2
            WHEN 'Equity' THEN 3
          END,
          a.code;
      `;

      const result = await pool.query(query, [req.userId]);

      const assets = result.rows.filter(r => r.type === 'Asset').reduce((sum, r) => sum + (r.balance || 0), 0);
      const liabilities = result.rows.filter(r => r.type === 'Liability').reduce((sum, r) => sum + (r.balance || 0), 0);
      const equity = result.rows.filter(r => r.type === 'Equity').reduce((sum, r) => sum + (r.balance || 0), 0);

      res.json({
        report: 'Balance Sheet',
        date: new Date(),
        items: result.rows,
        summary: {
          totalAssets: parseFloat(assets.toFixed(2)),
          totalLiabilities: parseFloat(liabilities.toFixed(2)),
          totalEquity: parseFloat(equity.toFixed(2)),
          balanced: Math.abs(assets - (liabilities + equity)) < 0.01,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ReportController;
