# AccountPro Backend API

A comprehensive Node.js/Express backend for the AccountPro AI accounting software. This API provides full accounting functionality with user authentication, multi-user support, journal entries, chart of accounts, automated posting queue, and AI-powered features.

## Features

✅ **User Management** - Secure registration, login, and profile management  
✅ **Chart of Accounts** - Create and manage accounts by type  
✅ **Journal Entries** - Record transactions with automatic double-entry bookkeeping  
✅ **Bank Integration** - Connect to multiple sources for transaction imports  
✅ **Auto-Post Queue** - Review and process transactions before posting  
✅ **Financial Reports** - Trial Balance, Income Statement, Balance Sheet  
✅ **AI Chat Interface** - AI-powered suggestions and analysis  
✅ **Data Import** - CSV and Excel file import support  

## Prerequisites

- **Node.js** 14+ and npm
- **PostgreSQL** 12+
- **Git**

## Installation

1. **Clone and navigate:**
   ```bash
   cd accountpro-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create database:**
   ```bash
   createdb accountpro_db
   ```

4. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=accountpro_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5000
   JWT_SECRET=your_secret_key_change_this
   ```

5. **Run migrations:**
   ```bash
   npm run migrate
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Accounts (Chart of Accounts)
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts/:accountId` - Get account details
- `PUT /api/accounts/:accountId` - Update account
- `DELETE /api/accounts/:accountId` - Delete account

### Journal Entries
- `GET /api/entries` - List entries
- `POST /api/entries` - Create entry
- `GET /api/entries/:entryId` - Get entry details
- `GET /api/entries/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get entries in date range
- `PUT /api/entries/:entryId` - Update entry
- `DELETE /api/entries/:entryId` - Delete entry

### Sources (Bank Integration)
- `GET /api/sources` - List sources
- `POST /api/sources` - Create source
- `GET /api/sources/:sourceId` - Get source details
- `PUT /api/sources/:sourceId` - Update source
- `DELETE /api/sources/:sourceId` - Delete source

### Queue (Auto-Post)
- `GET /api/queue` - List queue items
- `POST /api/queue` - Add to queue
- `PUT /api/queue/:queueId` - Update queue status
- `POST /api/queue/:queueId/process` - Process queue item
- `DELETE /api/queue/:queueId` - Delete queue item

### Reports
- `GET /api/reports/trial-balance` - Generate trial balance
- `GET /api/reports/income-statement?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Generate income statement
- `GET /api/reports/balance-sheet` - Generate balance sheet

### AI Chat
- `POST /api/ai/message` - Send message to AI
- `GET /api/ai/history` - Get chat history
- `DELETE /api/ai/history` - Clear chat history
- `POST /api/ai/suggestion` - Save AI suggestion
- `GET /api/ai/suggestions` - Get AI suggestions

## Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "fullName": "John Doe"
  }'
```

### Create Account
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cash",
    "type": "Asset",
    "code": "1000",
    "description": "Company cash account",
    "balance": 5000
  }'
```

### Create Journal Entry
```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entryDate": "2024-01-15",
    "description": "Initial bank deposit",
    "lines": [
      {"accountId": 1, "debit": 10000, "credit": 0, "description": "Cash deposit"},
      {"accountId": 2, "debit": 0, "credit": 10000, "description": "Owner contribution"}
    ]
  }'
```

### Get Trial Balance
```bash
curl -X GET http://localhost:5000/api/reports/trial-balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

The backend uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **accounts** - Chart of accounts
- **journal_entries** - Transaction entries
- **entry_lines** - Individual debit/credit lines
- **sources** - Bank/cash source connections
- **queue** - Pending transactions for review
- **ai_chat** - AI chat message history
- **ai_suggestions** - AI-generated entry suggestions

## Project Structure

```
accountpro-backend/
├── src/
│   ├── config/
│   │   ├── database.js        # Database connection
│   │   └── jwt.js             # JWT utilities
│   ├── controllers/           # Business logic
│   ├── middleware/            # Express middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   └── server.js              # Main server file
├── migrations/
│   ├── 001_initial_schema.sql # Database schema
│   └── runMigrations.js       # Migration runner
├── .env.example               # Environment template
├── package.json
└── README.md
```

## Development

### Run in development mode with auto-reload:
```bash
npm run dev
```

### Run tests:
```bash
npm test
```

### Check server health:
```bash
curl http://localhost:5000/health
```

## Integration with Frontend

Update your HTML frontend to connect to this API:

```javascript
const API_BASE = 'http://localhost:5000/api';

// Example: Login
async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

// Example: Get accounts
async function getAccounts() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/accounts`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

## Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- Authentication required for all protected routes
- CORS configured for frontend origin
- Input validation on all endpoints
- SQL injection prevention via parameterized queries

## Troubleshooting

### Connection refused on port 5000
- Check if Node.js process is running: `lsof -i :5000`
- Kill existing process and restart: `npm run dev`

### Database connection error
- Verify PostgreSQL is running
- Check DB credentials in `.env` file
- Ensure database exists: `createdb accountpro_db`

### Migration fails
- Check PostgreSQL is accessible
- Verify user has CREATE TABLE permissions
- Try: `npm run migrate` again

## Future Enhancements

- [ ] Multi-currency support
- [ ] Real bank API integration (Plaid, etc.)
- [ ] OpenAI GPT integration for advanced AI features
- [ ] Webhook support for real-time updates
- [ ] Batch import processing
- [ ] Audit trail logging
- [ ] Scheduled reports via email
- [ ] Mobile app support

## License

ISC

## Support

For issues or questions, create an issue in the repository or contact the development team.
