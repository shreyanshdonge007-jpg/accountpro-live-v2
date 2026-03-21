const Queue = require('../models/Queue');
const JournalEntry = require('../models/JournalEntry');

const QueueController = {
  async addToQueue(req, res) {
    try {
      const { sourceId, transactionData } = req.body;

      if (!sourceId || !transactionData) {
        return res.status(400).json({ error: 'Source ID and transaction data are required' });
      }

      const queueItem = await Queue.addToQueue(req.userId, sourceId, transactionData, 'pending');

      res.status(201).json({
        message: 'Added to queue successfully',
        queueItem,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getQueueItems(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;

      const items = await Queue.getQueueItems(req.userId, status, parseInt(limit), parseInt(offset));

      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateQueueStatus(req, res) {
    try {
      const { queueId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const item = await Queue.updateQueueStatus(queueId, req.userId, status);
      if (!item) {
        return res.status(404).json({ error: 'Queue item not found' });
      }

      res.json({
        message: 'Queue item updated successfully',
        item,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async processQueueItem(req, res) {
    try {
      const { queueId } = req.params;
      const { entryData } = req.body;

      if (!entryData) {
        return res.status(400).json({ error: 'Entry data is required' });
      }

      // Create journal entry
      const entry = await JournalEntry.createEntry(
        req.userId,
        entryData.entryDate,
        entryData.description,
        entryData.lines
      );

      // Update queue item
      const item = await Queue.processQueueItem(queueId, req.userId, entry.entry.id);

      res.json({
        message: 'Queue item processed successfully',
        entry: entry.entry,
        queueItem: item,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteQueueItem(req, res) {
    try {
      const { queueId } = req.params;

      const item = await Queue.deleteQueueItem(queueId, req.userId);
      if (!item) {
        return res.status(404).json({ error: 'Queue item not found' });
      }

      res.json({
        message: 'Queue item deleted successfully',
        queueId: item.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = QueueController;
