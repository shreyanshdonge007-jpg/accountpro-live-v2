// Configuration constants for AccountPro backend

const ACCOUNT_TYPES = {
  ASSET: 'Asset',
  LIABILITY: 'Liability',
  EQUITY: 'Equity',
  REVENUE: 'Revenue',
  EXPENSE: 'Expense',
};

const QUEUE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
};

const SOURCE_TYPES = {
  BANK: 'Bank',
  CASH: 'Cash',
  CREDIT_CARD: 'CreditCard',
  INVESTMENT: 'Investment',
  OTHER: 'Other',
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  ACCOUNT_NOT_FOUND: 'Account not found',
  ENTRY_NOT_FOUND: 'Entry not found',
  INVALID_ENTRY: 'Entry data is invalid',
  ENTRY_UNBALANCED: 'Debits must equal credits',
  UNAUTHORIZED: 'Unauthorized access',
  DATABASE_ERROR: 'Database error occurred',
};

module.exports = {
  ACCOUNT_TYPES,
  QUEUE_STATUS,
  SOURCE_TYPES,
  ERROR_MESSAGES,
};
