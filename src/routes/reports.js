const express = require('express');
const ReportController = require('../controllers/ReportController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/trial-balance', ReportController.getTrialBalance);
router.get('/income-statement', ReportController.getIncomeStatement);
router.get('/balance-sheet', ReportController.getBalanceSheet);

module.exports = router;
