# Personal Finance Tracker

A full-stack Personal Finance Tracker built with:

- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL
- **Frontend**: React, Vite, TypeScript

## Project Structure

```
.
├── backend/    # Express.js REST API
└── frontend/   # React SPA
```

## Running the Project

### Backend (Local)

```bash
cd backend
npm install
npm run migrate   # Run DB migrations
npm run dev       # Dev server on port 3000
```

### Backend (Docker)

```bash
cd backend
docker compose up --build   # Starts backend + PostgreSQL
```

> **Note:** Make sure you have copied `backend/.env.example` to `backend/.env` and filled in the values before running Docker.

### Frontend

```bash
cd frontend
npm install
npm run dev   # Vite dev server on port 5173
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values.
