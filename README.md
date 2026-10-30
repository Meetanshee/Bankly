# 🏦 Bankly – Banking Management System

A full-stack banking management application built using the **PERN stack (PostgreSQL, Express.js, React.js and Node.js)**. 
Bankly provides secure user authentication, multiple bank account management, deposits, withdrawals, balance tracking and transaction history through a React-based dashboard and RESTful backend APIs.

## 🌐 Live Demo

* **Frontend:** [bankly-one.vercel.app](https://bankly-one.vercel.app/)
* **Backend API:** https://bankly-nn86.onrender.com
* **GitHub Repository:** [Bankly](https://github.com/Meetanshee/Bankly)

## ✨ Features

### Authentication & Security

* User registration and login.
* Password hashing using bcrypt.
* JWT-based authentication and authorization.
* Protected frontend routes.
* JWT verification middleware for protected backend APIs.

### Account Management

* Create multiple Savings and Current accounts per user.
* Automatically generate unique 10-digit account numbers.
* View all accounts and individual account details.
* Update account-holder information.
* Delete bank accounts.
* Account ownership verification.

### Banking Operations

* Deposit money into bank accounts.
* Withdraw money from bank accounts.
* Real-time balance updates.
* Insufficient balance validation.
* Transaction history tracking.
* Filter transactions by deposits and withdrawals.

### Database & Transaction Management

* PostgreSQL relational database.
* Database constraints for data integrity.
* Atomic database transactions using `BEGIN`, `COMMIT` and `ROLLBACK`.
* Row-level locking using `SELECT ... FOR UPDATE`.
* Cascading deletion of dependent records.

### Dashboard

* React-based banking dashboard.
* Multiple account switching.
* Available balance display.
* Recent transaction history.
* Profile management.
* Loading indicators, success messages and error handling.

## 🛠️ Tech Stack

| Category        | Technologies                                           |
| --------------- | ------------------------------------------------------ |
| Frontend        | React.js, JavaScript, React Router, Axios, HTML5, CSS3 |
| Backend         | Node.js, Express.js                                    |
| Database        | PostgreSQL, SQL                                        |
| Authentication  | JWT, bcrypt                                            |
| Database Driver | pg                                                     |
| Configuration   | dotenv, Vite Environment Variables                     |
| Deployment      | Vercel, Render, Neon PostgreSQL                        |
| Tools           | Git, GitHub, Postman, VS Code                          |

## 🏗️ System Architecture

Bankly follows a modular backend architecture with separation of concerns.

```text
              React Frontend
                    |
                    v
                  Axios
                    |
                    v
              Express REST API
                    |
                    v
               Middleware
                    |
                    v
                Routes
                    |
                    v
               Controllers
                    |
                    v
                 Services
                    |
                    v
             PostgreSQL DB
```

### Database Relationships

```text
       USERS
         |
         | 1 : N
         |
      ACCOUNTS
         |
         | 1 : N
         |
    TRANSACTIONS
```

* One user can own multiple bank accounts.
* One bank account can have multiple transactions.

## 📡 REST API Endpoints

Bankly implements **11 REST API endpoints** covering authentication, account management and banking operations.

### 1. Authentication APIs

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| POST   | `/api/auth/register` | Register a new user           |
| POST   | `/api/auth/login`    | Authenticate an existing user |

### 2. Account Management APIs

| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| POST   | `/api/accounts`     | Create a new account          |
| GET    | `/api/accounts`     | Retrieve all user accounts    |
| GET    | `/api/accounts/:id` | Retrieve account details      |
| PUT    | `/api/accounts/:id` | Update account-holder details |
| DELETE | `/api/accounts/:id` | Delete an account             |

### 3. Banking APIs

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| POST   | `/api/accounts/:id/deposit`      | Deposit money                |
| POST   | `/api/accounts/:id/withdraw`     | Withdraw money               |
| GET    | `/api/accounts/:id/balance`      | Retrieve available balance   |
| GET    | `/api/accounts/:id/transactions` | Retrieve transaction history |

**Transaction filtering:**

* `/api/accounts/:id/transactions?type=DEPOSIT`
* `/api/accounts/:id/transactions?type=WITHDRAW`

All account and banking endpoints require valid JWT authentication.

## 🗄️ Database Schema

The application uses three PostgreSQL tables.

### Users

Stores registered user information:

* `id`
* `name`
* `email`
* `password`
* `created_at`

### Accounts

Stores bank account information:

* `id`
* `user_id`
* `account_number`
* `account_holder_name`
* `account_type`
* `balance`
* `created_at`

### Transactions

Stores transaction records:

* `id`
* `account_id`
* `transaction_type`
* `amount`
* `available_balance`
* `transaction_date`

### Database Constraints

* Primary key constraints.
* Foreign key constraints.
* Unique email and account number constraints.
* Account number format validation.
* Account type validation.
* Non-negative balance validation.
* Positive transaction amount validation.
* Cascading deletion using `ON DELETE CASCADE`.

## ⚙️ Backend Architecture

The backend follows a layered architecture.

```text
server/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── accountController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── accountRoutes.js
│   │
│   ├── services/
│   │   ├── authServices.js
│   │   └── accountService.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── accountNumberGenerator.js
│   │   ├── accountMapper.js
│   │   └── transactionMapper.js
│   │
│   ├── app.js
│   └── server.js
│
└── package.json
```

## 🔐 Important Technical Implementations

### 1. JWT Authentication

Implemented JWT-based authentication to secure protected APIs and identify authenticated users.

### 2. Atomic Database Transactions

Used PostgreSQL transactions with `BEGIN`, `COMMIT` and `ROLLBACK` to ensure that account balance updates and transaction history records remain consistent.

### 3. Concurrent Transaction Handling

Implemented `SELECT ... FOR UPDATE` row-level locking to prevent concurrent transactions from modifying the same account balance simultaneously.

### 4. Account Ownership Authorization

Implemented user-level ownership checks in database queries to ensure that users can access and modify only their own accounts.

### 5. Unique Account Number Generation

Implemented automatic 10-digit account number generation with duplicate handling using PostgreSQL's `ON CONFLICT` mechanism.

### 6. Centralized API Configuration

Created a reusable Axios instance with environment-based API configuration and request interceptors for automatically attaching JWT Bearer tokens.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/Meetanshee/Bankly.git

cd Bankly
```

### 2. Backend Setup

```bash
cd server

npm install
```

Create a `.env` file inside the `server` directory:

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

Create the database in PostgreSQL:

```sql
CREATE DATABASE bank_db;
```

Run the database schema using the project's `schema.sql` file.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client

npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The application will run on the local Vite development URL displayed in your terminal.

## 🧪 Testing Checklist

The following workflows should be verified before release:

* [ ] Register a new user.
* [ ] Login with valid credentials.
* [ ] Reject invalid credentials.
* [ ] Create a Savings account.
* [ ] Create a Current account.
* [ ] Create multiple accounts under one user.
* [ ] Retrieve account details.
* [ ] View available balance.
* [ ] Deposit money.
* [ ] Withdraw money.
* [ ] Reject invalid transaction amounts.
* [ ] Reject withdrawals exceeding available balance.
* [ ] Verify transaction history.
* [ ] Filter deposits and withdrawals.
* [ ] Update account-holder details.
* [ ] Delete an account.
* [ ] Verify cascading deletion.
* [ ] Reject protected API requests with missing or invalid JWT tokens.

## 🔮 Future Improvements

* Automated backend testing.
* Swagger/OpenAPI documentation.
* API rate limiting.
* Audit logging.
* Transaction pagination.
* Improved production security and monitoring.

## 👩‍💻 Author

**Meetanshee Gupta**

B.Tech Computer Science & Engineering

[GitHub Profile](https://github.com/Meetanshee)

---

⭐ If you find this project interesting, consider giving the repository a star!
