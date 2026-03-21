const express = require('express');
const EntryController = require('../controllers/EntryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', EntryController.createEntry);
router.get('/', EntryController.getEntries);
router.get('/range', EntryController.getEntriesByDateRange);
router.get('/:entryId', EntryController.getEntry);
router.put('/:entryId', EntryController.updateEntry);
router.delete('/:entryId', EntryController.deleteEntry);

module.exports = router;
