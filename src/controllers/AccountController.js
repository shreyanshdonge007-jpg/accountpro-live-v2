const Account = require('../models/Account');

const AccountController = {
  async createAccount(req, res) {
    try {
      const { name, type, code, description, balance } = req.body;

      if (!name || !type || !code) {
        return res.status(400).json({ error: 'Name, type, and code are required' });
      }

      const account = await Account.createAccount(
        req.userId,
        name,
        type,
        code,
        description,
        balance || 0
      );

      res.status(201).json({
        message: 'Account created successfully',
        account,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAccount(req, res) {
    try {
      const { accountId } = req.params;

      const account = await Account.getAccountById(accountId, req.userId);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAccounts(req, res) {
    try {
      const { type } = req.query;

      let accounts;
      if (type) {
        accounts = await Account.getAccountsByType(req.userId, type);
      } else {
        accounts = await Account.getAccountsByUser(req.userId);
      }

      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateAccount(req, res) {
    try {
      const { accountId } = req.params;
      const { name, description } = req.body;

      const account = await Account.updateAccount(accountId, req.userId, { name, description });
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json({
        message: 'Account updated successfully',
        account,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteAccount(req, res) {
    try {
      const { accountId } = req.params;

      const account = await Account.deleteAccount(accountId, req.userId);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json({
        message: 'Account deleted successfully',
        accountId: account.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = AccountController;
