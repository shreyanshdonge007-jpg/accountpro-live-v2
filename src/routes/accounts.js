const express = require('express');
const AccountController = require('../controllers/AccountController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', AccountController.createAccount);
router.get('/', AccountController.getAccounts);
router.get('/:accountId', AccountController.getAccount);
router.put('/:accountId', AccountController.updateAccount);
router.delete('/:accountId', AccountController.deleteAccount);

module.exports = router;
