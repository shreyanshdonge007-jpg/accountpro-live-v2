const express = require('express');
const QueueController = require('../controllers/QueueController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', QueueController.addToQueue);
router.get('/', QueueController.getQueueItems);
router.put('/:queueId', QueueController.updateQueueStatus);
router.post('/:queueId/process', QueueController.processQueueItem);
router.delete('/:queueId', QueueController.deleteQueueItem);

module.exports = router;
