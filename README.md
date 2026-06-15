# 💰 Personal Finance Tracker

A production-ready Personal Finance Tracker built with a strong emphasis on **Backend Engineering, Clean Architecture, Scalability, and Maintainability**.

The project demonstrates how to design and implement a real-world financial application using **Node.js, Express.js, TypeScript, PostgreSQL, and Raw SQL**, following industry-standard engineering practices instead of relying on heavy frameworks or ORMs.

---

# 🔗 Live Deployment

### Frontend

https://lucky-souffle-baf50b.netlify.app

### Backend API

https://fj-be-r2-bhavya-jain-scaler-school-of.onrender.com

---

# 📽️ Project Showcase

* Loom Video: **https://www.loom.com/share/7704e81b0ab649be93aa0d78e5894180**
* Postman Collection: **https://www.postman.com/bhav0207/my-workspace/collection/k0dtf16/fisker-jordan?action=share&source=copy-link&creator=45988199**

---

# 🎯 Project Goals

This project was built to demonstrate:

* Backend Architecture Design
* Clean Code Principles
* Repository Pattern
* Service Layer Pattern
* Raw SQL Engineering
* Authentication & Authorization
* Financial Data Modelling
* Multi-Currency Design
* Production-ready REST API Design

Rather than focusing only on features, this project focuses on **building software that is maintainable, scalable, and easy to extend.**

---

# 🏗️ Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Raw SQL
* JWT Authentication
* Google OAuth 2.0
* bcrypt
* Zod
* node-cron
* SendGrid

## Frontend

* React 19
* Vite
* Recharts
* Lucide React

---

# 🏛️ Architecture

The application follows a **Feature-First Architecture** combined with **Repository Pattern** and **Service Layer Pattern**.

```
Client

↓

Controller

↓

Service Layer

↓

Repository Layer

↓

PostgreSQL
```

Every layer has a single responsibility.

---

# 📂 Folder Structure

```
src

├── config

├── database

├── middleware

├── modules

│   ├── auth

│   ├── user

│   ├── category

│   ├── transaction

│   ├── budget

│   ├── receipt

│   ├── dashboard

│   └── reports

├── shared

└── server.ts
```

Each feature owns its:

* Controller
* Service
* Repository
* DTOs
* Validation
* Entity

which improves maintainability and scalability.

---

# 🧠 Architectural Decisions

## Why Raw SQL instead of ORM?

Raw SQL was intentionally chosen to:

* Gain full control over queries
* Improve query performance
* Understand relational databases deeply
* Avoid ORM abstractions
* Learn SQL optimization

---

## Why Feature-First Architecture?

Instead of grouping files by type:

```
controllers/

services/

repositories/
```

the project groups everything by business domain:

```
transaction/

budget/

auth/

user/
```

This scales significantly better as the project grows.

---

## Why Repository Pattern?

Repositories are responsible only for persistence.

They:

* execute SQL
* map snake_case to camelCase
* return entities

Repositories never contain business logic.

---

## Why Service Layer?

Business rules belong in services.

Examples:

* password hashing
* duplicate email check
* category ownership validation
* JWT generation
* exchange rate calculation

This keeps controllers thin and repositories focused on persistence.

---

## DTO vs Entity Separation

DTOs represent communication objects.

Entities represent application objects.

This prevents leaking persistence details into API contracts and makes future changes easier.

---

# 🔐 Security Decisions

The project follows multiple security best practices.

* Password hashing using bcrypt
* JWT Authentication
* Protected Routes
* Parameterized SQL Queries
* Global Error Handling
* Input Validation using Zod
* User Isolation
* Authorization checks on every protected resource

The authenticated user is always extracted from the JWT token.

The client never sends user IDs, preventing horizontal privilege escalation.

---

# 💰 Multi Currency Design

One of the key engineering decisions was implementing proper multi-currency support.

Each transaction stores:

```
amount

currency

exchange_rate

base_amount
```

Example:

```
100 USD

↓

exchange rate

↓

8352 INR (base_amount)
```

All dashboard calculations and reports aggregate using **base_amount**, ensuring mathematically correct financial summaries even when transactions exist in different currencies.

Historical exchange rates are preserved for accurate historical reporting.

---

# 📊 Core Features

## Authentication

* Register
* Login
* JWT Authentication
* Google OAuth
* Profile Management

---

## Categories

* System Categories
* Custom Categories
* CRUD Operations

---

## Transactions

* Income
* Expense
* Refund

Supports:

* Pagination
* Filtering
* Sorting
* Multi Currency
* Category Validation

---

## Budgets

* Budget Creation
* Budget Tracking
* Budget Progress
* Budget Updates
* Budget Deletion

---

## Notifications

A scheduled cron job runs every day and checks all budgets.

If spending exceeds the configured budget:

* Email notification is triggered
* SendGrid sends the alert
* Duplicate notifications are prevented

---

## Dashboard

Real-time analytics including:

* Total Income
* Total Expense
* Total Refund
* Net Savings
* Saving Rate
* Budget Usage
* Budget Remaining
* Expense by Category
* Monthly Trends
* Recent Transactions

---

## Reports

Financial reporting includes:

* Overall Summary
* Category-wise Spending
* Monthly Trends

---

## Receipt Management

Receipts are linked one-to-one with transactions and support full CRUD operations.

---

# 🗄️ Database Design

Tables:

* users
* categories
* transactions
* budgets
* receipts

Dashboard and Reports are **derived from transactions** and intentionally do not have dedicated tables.

This avoids data duplication and maintains consistency.

---

# 🧱 Design Principles

The project follows:

* Single Responsibility Principle
* Separation of Concerns
* Repository Pattern
* Service Layer Pattern
* Thin Controllers
* Feature First Architecture
* DTO Pattern
* Entity Pattern
* Functional Programming Style

---

# ⚙️ Local Setup

## Clone

```bash
git clone https://github.com/BHAV0207/FJ-BE-R2-Bhavya-Jain-Scaler-School-Of-Technology.git

cd FJ-BE-R2-Bhavya-Jain-Scaler-School-Of-Technology
```

## Backend

```bash
cd backend

npm install

cp .env.example .env

npm run migrate

npm run dev
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker

Build

```bash
docker compose build
```

Run

```bash
docker compose up
```

---

# 📈 Scalability Considerations

The project has been designed to support future enhancements with minimal changes.

Possible extensions include:

* Redis caching
* Kafka event-driven architecture
* Microservice decomposition
* Exchange Rate APIs
* File Storage using S3
* Background Job Queues
* Analytics Engine
* AI-powered Expense Insights

The chosen architecture ensures these additions can be implemented without major refactoring.

---

# 🧪 Engineering Highlights

* Feature-first architecture
* Raw SQL without ORM
* JWT + Google OAuth
* Repository Pattern
* Service Layer Pattern
* Multi-Currency Engine
* Budget Notification Scheduler
* SendGrid Integration
* Clean DTO & Entity Separation
* Strong Input Validation
* Production-ready Error Handling

---

# 👨‍💻 Author

## Bhavya Jain

Backend Engineering Project

Scaler School of Technology

Built with a focus on clean architecture, backend engineering best practices, and scalable system design.
