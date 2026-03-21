const JournalEntry = require('../models/JournalEntry');

const EntryController = {
  async createEntry(req, res) {
    try {
      const { entryDate, description, lines } = req.body;

      if (!entryDate || !lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({ error: 'Entry date and lines are required' });
      }

      // Validate that debits equal credits
      const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
      const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({ error: 'Debits must equal credits' });
      }

      const entry = await JournalEntry.createEntry(req.userId, entryDate, description, lines);

      res.status(201).json({
        message: 'Journal entry created successfully',
        entry,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEntry(req, res) {
    try {
      const { entryId } = req.params;

      const entry = await JournalEntry.getEntryById(entryId, req.userId);
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEntries(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const entries = await JournalEntry.getEntriesByUser(req.userId, parseInt(limit), parseInt(offset));

      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEntriesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const entries = await JournalEntry.getEntriesByDateRange(req.userId, startDate, endDate);

      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateEntry(req, res) {
    try {
      const { entryId } = req.params;
      const { description } = req.body;

      const entry = await JournalEntry.updateEntry(entryId, req.userId, { description });
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json({
        message: 'Entry updated successfully',
        entry,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteEntry(req, res) {
    try {
      const { entryId } = req.params;

      const entry = await JournalEntry.deleteEntry(entryId, req.userId);
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json({
        message: 'Entry deleted successfully',
        entryId: entry.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = EntryController;
