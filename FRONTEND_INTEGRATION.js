// Frontend Integration Guide for AccountPro Backend

// ============================================
// 1. API Configuration
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getAuthToken() {
  return localStorage.getItem('accountpro_token');
}

// Set token in localStorage
function setAuthToken(token) {
  localStorage.setItem('accountpro_token', token);
}

// Clear token from localStorage
function clearAuthToken() {
  localStorage.removeItem('accountpro_token');
}

// ============================================
// 2. Auth API Functions
// ============================================

async function registerUser(email, password, fullName) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    const data = await response.json();
    if (response.ok) {
      setAuthToken(data.token);
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      setAuthToken(data.token);
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

async function getProfile() {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

// ============================================
// 3. Account API Functions
// ============================================

async function createAccount(name, type, code, description = '', balance = 0) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, type, code, description, balance })
    });
    const data = await response.json();
    if (response.ok) {
      return data.account;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Create account error:', error);
    throw error;
  }
}

async function getAccounts(type = null) {
  const token = getAuthToken();
  try {
    let url = `${API_BASE_URL}/accounts`;
    if (type) url += `?type=${type}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Get accounts error:', error);
    throw error;
  }
}

async function getAccount(accountId) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get account error:', error);
    throw error;
  }
}

// ============================================
// 4. Journal Entry API Functions
// ============================================

async function createJournalEntry(entryDate, description, lines) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entryDate,
        description,
        lines
      })
    });
    const data = await response.json();
    if (response.ok) {
      return data.entry;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Create entry error:', error);
    throw error;
  }
}

async function getJournalEntries(limit = 50, offset = 0) {
  const token = getAuthToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/entries?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Get entries error:', error);
    throw error;
  }
}

async function getJournalEntry(entryId) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/entries/${entryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get entry error:', error);
    throw error;
  }
}

async function getEntriesByDateRange(startDate, endDate) {
  const token = getAuthToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/entries/range?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Get entries by date range error:', error);
    throw error;
  }
}

// ============================================
// 5. Reports API Functions
// ============================================

async function getTrialBalance() {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/reports/trial-balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get trial balance error:', error);
    throw error;
  }
}

async function getIncomeStatement(startDate, endDate) {
  const token = getAuthToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/income-statement?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Get income statement error:', error);
    throw error;
  }
}

async function getBalanceSheet() {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/reports/balance-sheet`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get balance sheet error:', error);
    throw error;
  }
}

// ============================================
// 6. AI Chat API Functions
// ============================================

async function sendAIMessage(message) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/ai/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Send AI message error:', error);
    throw error;
  }
}

async function getAIChatHistory(limit = 100) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/ai/history?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get chat history error:', error);
    throw error;
  }
}

// ============================================
// 7. Sources API Functions
// ============================================

async function createSource(name, type, connectionDetails = {}) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/sources`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, type, connectionDetails })
    });
    const data = await response.json();
    if (response.ok) {
      return data.source;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Create source error:', error);
    throw error;
  }
}

async function getSources() {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/sources`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get sources error:', error);
    throw error;
  }
}

// ============================================
// 8. Queue API Functions
// ============================================

async function addToQueue(sourceId, transactionData) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/queue`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sourceId, transactionData })
    });
    const data = await response.json();
    if (response.ok) {
      return data.queueItem;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Add to queue error:', error);
    throw error;
  }
}

async function getQueueItems(status = null) {
  const token = getAuthToken();
  try {
    let url = `${API_BASE_URL}/queue`;
    if (status) url += `?status=${status}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Get queue items error:', error);
    throw error;
  }
}

async function processQueueItem(queueId, entryData) {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/queue/${queueId}/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ entryData })
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Process queue item error:', error);
    throw error;
  }
}

// ============================================
// 9. Usage Examples
// ============================================

// Example: Register and login
/*
async function handleLogin() {
  try {
    const user = await loginUser('user@example.com', 'password123');
    console.log('Logged in:', user);
    
    // Get user profile
    const profile = await getProfile();
    console.log('Profile:', profile);
    
    // Get accounts
    const accounts = await getAccounts();
    console.log('Accounts:', accounts);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
*/

// Example: Create and get entries
/*
async function handleCreateEntry() {
  try {
    const account1 = await getAccounts('Asset'); // Get first asset account
    const account2 = await getAccounts('Revenue'); // Get first revenue account
    
    const entry = await createJournalEntry(
      '2024-01-15',
      'Initial bank deposit',
      [
        { accountId: account1[0].id, debit: 10000, credit: 0 },
        { accountId: account2[0].id, debit: 0, credit: 10000 }
      ]
    );
    console.log('Entry created:', entry);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
*/

// Example: Generate reports
/*
async function handleReports() {
  try {
    const trialBalance = await getTrialBalance();
    console.log('Trial Balance:', trialBalance);
    
    const income = await getIncomeStatement('2024-01-01', '2024-01-31');
    console.log('Income Statement:', income);
    
    const balance = await getBalanceSheet();
    console.log('Balance Sheet:', balance);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
*/

export {
  // Auth
  registerUser,
  loginUser,
  getProfile,
  clearAuthToken,
  getAuthToken,
  
  // Accounts
  createAccount,
  getAccounts,
  getAccount,
  
  // Entries
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  getEntriesByDateRange,
  
  // Reports
  getTrialBalance,
  getIncomeStatement,
  getBalanceSheet,
  
  // AI
  sendAIMessage,
  getAIChatHistory,
  
  // Sources
  createSource,
  getSources,
  
  // Queue
  addToQueue,
  getQueueItems,
  processQueueItem,
};
