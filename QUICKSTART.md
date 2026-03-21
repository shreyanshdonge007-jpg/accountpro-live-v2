# 🚀 AccountPro Backend - Quick Start Guide

Welcome to the AccountPro Backend! This guide will get you up and running in 5 minutes.

## Prerequisites

Before starting, ensure you have installed:
- **Node.js** 14+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version
npm --version
psql --version
```

## 1️⃣ Initial Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd accountpro-backend
npm install
```

### Step 2: Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql, create the database:
CREATE DATABASE accountpro_db;
\q
```

Or use one command:
```bash
createdb -U postgres accountpro_db
```

### Step 3: Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings (using any text editor)
# Most important variables:
DB_PASSWORD=your_postgres_password
JWT_SECRET=change_this_to_something_random
```

### Step 4: Run Migrations
```bash
npm run migrate
```

You should see: `✅ Migrations completed successfully`

### Step 5: Start the Server
```bash
npm run dev
```

You should see:
```
🚀 AccountPro API Server running on http://localhost:5000
📊 Health check: http://localhost:5000/health
```

## ✅ Verify Installation

Test the API is working:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-01-15T10:30:00Z"}
```

## 🎯 Next Steps

### 1. Register Your First User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@company.com",
    "password": "DemoPassword123",
    "fullName": "Demo User"
  }'
```

Save the returned `token` for next requests.

### 2. Create Chart of Accounts
```bash
# Set your token for easier testing
export TOKEN="your_token_from_above"

# Create an Asset account
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cash",
    "type": "Asset",
    "code": "1000"
  }'
```

### 3. Record Your First Entry
```bash
# Create a journal entry (after creating accounts)
curl -X POST http://localhost:5000/api/entries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entryDate": "2024-01-15",
    "description": "Initial deposit",
    "lines": [
      {"accountId": 1, "debit": 5000, "credit": 0},
      {"accountId": 2, "debit": 0, "credit": 5000}
    ]
  }'
```

## 📚 Documentation

Full documentation available in:
- **[README.md](README.md)** - Complete API documentation
- **[API_TESTING.md](API_TESTING.md)** - Detailed testing examples
- **[FRONTEND_INTEGRATION.js](FRONTEND_INTEGRATION.js)** - Frontend integration code

## 🔍 Troubleshooting

### "Cannot find module 'express'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Connection refused" on Database
```bash
# Check PostgreSQL is running
# Windows: Use PostgreSQL Services in Task Manager
# Mac/Linux: 
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Verify credentials in .env file
```

### "Port 5000 already in use"
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in .env:
PORT=5001
```

### Server crashes after migration
```bash
# Check PostgreSQL connection
psql -U postgres -d accountpro_db -c "SELECT 1"

# Re-run migrations
npm run migrate
```

## 📁 Project Structure

```
accountpro-backend/
├── src/
│   ├── config/          # Database, JWT, constants
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Main server
├── migrations/          # Database schema
├── package.json
├── .env                 # Your configuration
└── README.md
```

## 🔐 Security Checklist

Before production:
- [ ] Change `JWT_SECRET` in `.env` to a strong random string
- [ ] Change `DB_PASSWORD` to a strong password
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Set `CORS_ORIGIN` to your frontend domain
- [ ] Use HTTPS in production
- [ ] Set up regular database backups

## 📊 Available Endpoints

### Public
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login to account
- `GET /health` - Health check

### Protected (requires token)
- `GET /api/accounts` - List accounts
- `POST /api/entries` - Create entry
- `GET /api/reports/trial-balance` - View trial balance
- `GET /api/ai/history` - Chat history
- ... and many more (see README.md)

## 🎓 Learn More

1. Check out **[API_TESTING.md](API_TESTING.md)** for complete workflow examples
2. Review **[FRONTEND_INTEGRATION.js](FRONTEND_INTEGRATION.js)** to connect your HTML frontend
3. Read **[README.md](README.md)** for detailed API documentation

## 💡 Tips

- Use **Postman** or **Insomnia** for easier API testing
- Keep your JWT token safe - don't commit it to version control
- Test thoroughly before connecting to your frontend
- Review error messages - they usually indicate what's wrong
- Check the console output for helpful debugging info

## 🆘 Getting Help

If you encounter issues:

1. Check the error message in terminal output
2. Review the troubleshooting section above
3. Check README.md for more details
4. Verify database connection with: `psql -U postgres -d accountpro_db`
5. Check logs for specific error messages

## 🎉 You're Ready!

Your backend is now running! Next:

1. **Connect your frontend** - Use FRONTEND_INTEGRATION.js as a guide
2. **Test workflows** - Follow examples in API_TESTING.md
3. **Deploy** - Deploy to production when ready

Happy accounting! 📊
