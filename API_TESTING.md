# AccountPro API Testing Guide

This guide provides examples and instructions for testing the AccountPro API using cURL, Postman, or any HTTP client.

## Table of Contents
1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Testing Workflows](#testing-workflows)
4. [Common Responses](#common-responses)

## Setup

First, ensure the backend is running:
```bash
npm run dev
```

The API will be available at: `http://localhost:5000`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mycompany@example.com",
    "password": "securePassword123",
    "fullName": "John Doe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "mycompany@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Save the token for subsequent requests:
```bash
export TOKEN="your_token_here"
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mycompany@example.com",
    "password": "securePassword123"
  }'
```

## Testing Workflows

### Workflow 1: Setup Chart of Accounts

#### 1.1 Create Asset Accounts

**Endpoint:** `POST /api/accounts`

```bash
# Create Cash account
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cash",
    "type": "Asset",
    "code": "1000",
    "description": "Company cash account",
    "balance": 0
  }'

# Create Bank account
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Checking Account",
    "type": "Asset",
    "code": "1010",
    "description": "Primary business bank account",
    "balance": 0
  }'

# Create Accounts Receivable
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accounts Receivable",
    "type": "Asset",
    "code": "1020",
    "description": "Customer invoices",
    "balance": 0
  }'
```

#### 1.2 Create Equity Accounts

```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Owner Capital",
    "type": "Equity",
    "code": "3000",
    "description": "Initial owner investment",
    "balance": 0
  }'
```

#### 1.3 Create Revenue Account

```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Revenue",
    "type": "Revenue",
    "code": "4000",
    "description": "Income from sales",
    "balance": 0
  }'
```

#### 1.4 Create Expense Account

```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Salary Expense",
    "type": "Expense",
    "code": "5000",
    "description": "Employee salaries",
    "balance": 0
  }'
```

### Workflow 2: Record Journal Entries

#### 2.1 Initial Investment

```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entryDate": "2024-01-01",
    "description": "Initial owner investment",
    "lines": [
      {
        "accountId": 1,
        "debit": 50000,
        "credit": 0,
        "description": "Cash from owner"
      },
      {
        "accountId": 4,
        "debit": 0,
        "credit": 50000,
        "description": "Owner equity investment"
      }
    ]
  }'
```

#### 2.2 Sales Transaction

```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entryDate": "2024-01-15",
    "description": "Sales to customer ABC",
    "lines": [
      {
        "accountId": 2,
        "debit": 5000,
        "credit": 0,
        "description": "Deposit from customer"
      },
      {
        "accountId": 5,
        "debit": 0,
        "credit": 5000,
        "description": "Sales revenue"
      }
    ]
  }'
```

#### 2.3 Expense Transaction

```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entryDate": "2024-01-20",
    "description": "Monthly salary payment",
    "lines": [
      {
        "accountId": 6,
        "debit": 3000,
        "credit": 0,
        "description": "January salary"
      },
      {
        "accountId": 1,
        "debit": 0,
        "credit": 3000,
        "description": "Cash payment"
      }
    ]
  }'
```

### Workflow 3: Generate Reports

#### 3.1 Trial Balance

```bash
curl -X GET http://localhost:5000/api/reports/trial-balance \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "report": "Trial Balance",
  "date": "2024-01-20T10:30:00Z",
  "accounts": [
    {
      "code": "1000",
      "name": "Cash",
      "type": "Asset",
      "balance": 52000,
      "debit": 52000,
      "credit": 0
    },
    {
      "code": "4000",
      "name": "Sales Revenue",
      "type": "Revenue",
      "balance": 5000,
      "debit": 0,
      "credit": 5000
    }
  ],
  "summary": {
    "totalDebit": 55000,
    "totalCredit": 55000,
    "balanced": true
  }
}
```

#### 3.2 Income Statement

```bash
curl -X GET "http://localhost:5000/api/reports/income-statement?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

#### 3.3 Balance Sheet

```bash
curl -X GET http://localhost:5000/api/reports/balance-sheet \
  -H "Authorization: Bearer $TOKEN"
```

### Workflow 4: Manage Sources and Queue

#### 4.1 Create Bank Source

```bash
curl -X POST http://localhost:5000/api/sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chase Business Checking",
    "type": "Bank",
    "connectionDetails": {
      "bankId": "CHASE123",
      "accountNumber": "****5678"
    }
  }'
```

#### 4.2 Add Transaction to Queue

```bash
curl -X POST http://localhost:5000/api/queue \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceId": 1,
    "transactionData": {
      "date": "2024-01-20",
      "amount": 1500,
      "description": "Customer deposit from invoice #12345",
      "transactionType": "deposit"
    }
  }'
```

#### 4.3 Get Queue Items

```bash
curl -X GET "http://localhost:5000/api/queue?status=pending" \
  -H "Authorization: Bearer $TOKEN"
```

#### 4.4 Process Queue Item

```bash
curl -X POST http://localhost:5000/api/queue/1/process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entryData": {
      "entryDate": "2024-01-20",
      "description": "Customer deposit",
      "lines": [
        {"accountId": 2, "debit": 1500, "credit": 0},
        {"accountId": 5, "debit": 0, "credit": 1500}
      ]
    }
  }'
```

### Workflow 5: AI Chat

#### 5.1 Send Message to AI

```bash
curl -X POST http://localhost:5000/api/ai/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What was my total revenue this month?"
  }'
```

#### 5.2 Get Chat History

```bash
curl -X GET http://localhost:5000/api/ai/history \
  -H "Authorization: Bearer $TOKEN"
```

## Common Responses

### Success Response (200)
```json
{
  "message": "Operation successful",
  "data": { }
}
```

### Created Response (201)
```json
{
  "message": "Resource created successfully",
  "resource": { }
}
```

### Error Response (400)
```json
{
  "error": "Invalid request parameters"
}
```

### Unauthorized Response (401)
```json
{
  "error": "Access token required"
}
```

### Not Found Response (404)
```json
{
  "error": "Resource not found"
}
```

### Server Error Response (500)
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## Tips for Testing

1. **Use environment variables** to store tokens and IDs
2. **Test in sequence** to build data properly
3. **Check validation errors** carefully for clues
4. **Use timestamps** to track entry dates
5. **Verify balanced entries** (debits = credits)
6. **Review error messages** for specific issues
7. **Export results** to JSON for analysis

## Next Steps

1. Integrate this API with the AccountPro HTML frontend
2. Set up error handling in the frontend
3. Implement loading states and user feedback
4. Test all workflows end-to-end
5. Set up production environment variables
