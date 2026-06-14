# 💰 Personal Finance Tracker API

A production-ready backend for a **Personal Finance Tracker** built with **Node.js, Express.js, TypeScript, PostgreSQL, and Raw SQL** following a **feature-first architecture** and clean backend engineering principles.

---

# 🚀 Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Google OAuth Login
- Protected Routes

---

## User Management

- Get Profile
- Update Profile
- Preferred Currency Support

---

## Categories

- System Categories
- Custom Categories
- Create Category
- Update Category
- Delete Category
- List Categories

---

## Transactions

- Create Transaction
- Update Transaction
- Delete Transaction
- Get Transaction by ID
- Get All Transactions
- Pagination
- Filtering
- Sorting

Supports:

- Income
- Expense
- Refund

---

## Budgets

- Create Budget
- Update Budget
- Delete Budget
- Budget Progress
- Budget Tracking

---

## Dashboard

Provides:

- Total Income
- Total Expense
- Total Refund
- Net Savings
- Saving Rate
- Budget Usage
- Budget Remaining
- Expense by Category
- Monthly Trend
- Recent Transactions

---

## Reports

- Financial Summary
- Category Wise Report
- Monthly Report

---

## Receipts

- Create Receipt
- Update Receipt
- Delete Receipt
- View Receipt

---

## Notifications

- Daily Budget Check Cron Job
- Email Notification when Budget Exceeds

---

## Multi Currency Support

Transactions store:

- Original Amount
- Original Currency
- Exchange Rate
- Base Amount

Financial reports and dashboard calculations use normalized base amounts to ensure accurate aggregation across multiple currencies.

---

# 🏗️ Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Raw SQL
- JWT
- bcrypt
- Zod
- node-cron

---

# 📁 Project Structure

```
src/

├── config/

├── database/

├── modules/

│ ├── auth/

│ ├── user/

│ ├── category/

│ ├── transaction/

│ ├── budget/

│ ├── receipt/

│ ├── dashboard/

│ └── reports/

├── shared/

├── middleware/

└── server.ts
```

---

# 🧱 Architecture

The project follows:

- Feature First Architecture
- Repository Pattern
- Service Layer Pattern
- Thin Controllers
- DTO Pattern
- Entity Pattern
- Global Error Handling
- Functional Programming Style

---

# 🔐 Authentication Flow

```
Client

↓

JWT Login

↓

Authorization Header

↓

JWT Middleware

↓

req.user.userId

↓

Service Layer

↓

Repository

↓

Database
```

---

# 💵 Multi Currency Design

Each transaction stores:

```
amount

currency

exchange_rate

base_amount
```

This preserves historical exchange rates and enables accurate reporting across multiple currencies.

---

# 🗄️ Database Tables

- users
- categories
- transactions
- budgets
- receipts

---

# ⚙️ Environment Variables

```
PORT=

DATABASE_URL=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_CALLBACK_URL=

EMAIL_HOST=

EMAIL_PORT=

EMAIL_USER=

EMAIL_PASS=

EMAIL_FROM=
```

---

# ▶️ Running Locally

Install dependencies:

```
npm install
```

Run migrations:

```
npm run migrate
```

Development:

```
npm run dev
```

Production:

```
npm run build

npm start
```

---

# 🐳 Docker

Build:

```
docker compose build
```

Run:

```
docker compose up
```

---

# 📌 API Modules

- Authentication
- Users
- Categories
- Transactions
- Budgets
- Dashboard
- Reports
- Receipts

---

# 🛡️ Security

- JWT Authentication
- Password Hashing
- Parameterized SQL Queries
- Authorization Checks
- Global Error Handling
- User Isolation

---

# 📈 Design Decisions

- Raw SQL instead of ORM for learning and performance.
- Repository Pattern for persistence isolation.
- Service Layer for business logic.
- Controllers remain thin.
- Database constraints enforce integrity.
- Business rules enforced in service layer.

---

# 👨‍💻 Author

Bhavya Jain

Backend Engineering Project

Built using Node.js, Express.js, TypeScript and PostgreSQL.
