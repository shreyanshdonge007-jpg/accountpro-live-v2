const express = require('express');
const SourceController = require('../controllers/SourceController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', SourceController.createSource);
router.get('/', SourceController.getSources);
router.get('/:sourceId', SourceController.getSource);
router.put('/:sourceId', SourceController.updateSource);
router.delete('/:sourceId', SourceController.deleteSource);

module.exports = router;
