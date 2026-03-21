const Source = require('../models/Source');

const SourceController = {
  async createSource(req, res) {
    try {
      const { name, type, connectionDetails } = req.body;

      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      const source = await Source.createSource(req.userId, name, type, connectionDetails || {});

      res.status(201).json({
        message: 'Source created successfully',
        source,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSource(req, res) {
    try {
      const { sourceId } = req.params;

      const source = await Source.getSourceById(sourceId, req.userId);
      if (!source) {
        return res.status(404).json({ error: 'Source not found' });
      }

      res.json(source);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSources(req, res) {
    try {
      const sources = await Source.getSourcesByUser(req.userId);

      res.json(sources);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSource(req, res) {
    try {
      const { sourceId } = req.params;
      const { name, isActive, connectionDetails } = req.body;

      const source = await Source.updateSource(sourceId, req.userId, {
        name,
        isActive,
        connectionDetails,
      });

      if (!source) {
        return res.status(404).json({ error: 'Source not found' });
      }

      res.json({
        message: 'Source updated successfully',
        source,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteSource(req, res) {
    try {
      const { sourceId } = req.params;

      const source = await Source.deleteSource(sourceId, req.userId);
      if (!source) {
        return res.status(404).json({ error: 'Source not found' });
      }

      res.json({
        message: 'Source deleted successfully',
        sourceId: source.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = SourceController;
