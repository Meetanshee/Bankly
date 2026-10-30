# Bankly - Banking Management System

Bankly is a full-stack banking application built with the PERN stack. It provides user authentication, bank account management, deposits, withdrawals, balance tracking, and transaction history through a React frontend and Express/PostgreSQL backend.

## Features

- User registration and login
- bcrypt password hashing
- JWT authentication and protected APIs
- Multiple Savings/Current accounts per user
- Automatically generated 10-digit account numbers
- Account CRUD operations
- Deposit and withdrawal operations
- Balance and transaction history
- Deposit/withdrawal transaction filtering
- Transactional balance updates and row locking for withdrawals
- PostgreSQL constraints and cascade deletion
- React banking dashboard

## Tech Stack

Frontend: React, React Router, Axios, CSS

Backend: Node.js, Express.js, PostgreSQL, pg, JWT, bcrypt, dotenv

## Architecture

```text
React Frontend -> Axios -> Express REST API -> Middleware -> Controllers -> Services -> PostgreSQL
```

```text
users 1:N accounts 1:N transactions
```

## API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Accounts

- POST `/api/accounts`
- GET `/api/accounts`
- GET `/api/accounts/:id`
- PUT `/api/accounts/:id`
- DELETE `/api/accounts/:id`

### Banking

- POST `/api/accounts/:id/deposit`
- POST `/api/accounts/:id/withdraw`
- GET `/api/accounts/:id/balance`
- GET `/api/accounts/:id/transactions`
- GET `/api/accounts/:id/transactions?type=DEPOSIT`
- GET `/api/accounts/:id/transactions?type=WITHDRAW`

All account and banking endpoints require a valid JWT.

## Environment Variables

Create `server/.env`:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bank_db
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432
JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=1d
```

Never commit `.env` to GitHub.

## Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## QA Checklist

- [ ] Register user
- [ ] Login with valid credentials
- [ ] Reject invalid credentials
- [ ] Create Savings account
- [ ] Create Current account
- [ ] Create multiple accounts
- [ ] View balance
- [ ] Deposit money
- [ ] Withdraw money
- [ ] Reject invalid amounts
- [ ] Reject insufficient balance
- [ ] Verify transaction history
- [ ] Verify transaction filters
- [ ] Update account-holder name
- [ ] Delete account
- [ ] Verify cascade deletion
- [ ] Verify protected endpoints reject invalid/missing JWT

## Project Scope

The current scope intentionally does not include mobile-number authentication, OTP, or transaction PIN functionality.

## Future Improvements

- Automated backend tests
- Swagger/OpenAPI documentation
- Production deployment
- Rate limiting
- Audit logging
- Transaction pagination

## Status

Core banking functionality and the React dashboard are implemented. Final QA and deployment completed before presenting the project as production-ready.
