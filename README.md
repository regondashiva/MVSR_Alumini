# MVSR Engineering College Alumni Network

A comprehensive alumni and college management website for MVSR Engineering College built with **Go backend** and React frontend.

## 🏗️ Technology Stack

### Backend (Go)
- **Go 1.21** - Programming language
- **Gin Framework** - HTTP web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Docker** - Containerization

### Frontend (React)
- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- Node.js 16+
- MongoDB
- Docker (optional)

### Backend Setup
```bash
cd backend-go
cp .env.example .env
go mod tidy
go run main.go
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker Setup
```bash
docker-compose up -d
```

```
MVSR-Alumni/
├── backend-go/           # Go backend API
│   ├── controllers/       # HTTP handlers
│   ├── middleware/        # Middleware functions
# MVSR Alumni Portal

This repository contains the MVSR Engineering College alumni portal: a React frontend and a Go backend that together provide user registration, authentication, alumni directory, news, gallery, events and job listings.

This README replaces older, out-of-sync docs and focuses on how to run this specific Go + React project locally.

## Tech stack
- Backend: Go (Gin), MySQL, JWT
- Frontend: React (Create React App), Tailwind CSS
- Proxy: frontend dev server proxies `/api` to the backend at `http://localhost:8082`

## Quick local setup

Prerequisites
- Go 1.20+ installed
- Node.js 16+ / npm
- MySQL server (or compatible) running locally

High-level steps
1. Configure the database and run migrations
2. Start the Go backend on port `8082`
3. Start the React frontend (dev server proxies to backend)

### 1) Database / Migrations

This project uses MySQL. A migration helper is provided at `backend-go/migrations/create_tables.go`.

Edit the DSN in that file or run it from an environment where `root:root@tcp(localhost:3306)/` works, then:

```bash
cd backend-go
go run migrations/create_tables.go
```

This will create the `mvsr_alumni` database and all required tables including `users`, `news`, `gallery`, `refresh_tokens`, and `password_reset_tokens`.

If you prefer to run migrations manually, apply the SQL in `backend-go/migrations/*` against your MySQL server.

### 2) Start backend

```bash
cd backend-go
cp .env.example .env    # update values as needed (PORT, DB DSN, JWT secrets)
go mod tidy
go run main.go
```

Default backend address: `http://localhost:8082`

Key backend files
- `backend-go/main.go` — app bootstrap and server
- `backend-go/routes/routes.go` — API route registration
- `backend-go/controllers/auth.go` — authentication handlers

### 3) Start frontend

```bash
cd frontend
npm install
npm start
```

The frontend dev server runs at `http://localhost:3000` and proxies `/api` to the backend (`http://localhost:8082`) via `frontend/src/setupProxy.js`.

To build a production bundle:

```bash
cd frontend
npm run build
```

## Authentication & Password Reset

- Login: `POST /api/v1/auth/login` — the backend accepts either `email` or `rollNumber` plus `password`.
- Register: `POST /api/v1/auth/register`
- Forgot password: `POST /api/v1/auth/forgot-password` — generates a reset token persisted in `password_reset_tokens`.
- Reset password: `POST /api/v1/auth/reset-password` — submit `{ token, newPassword }` to reset.

The frontend includes pages for these flows:
- `frontend/src/pages/LoginSimple.js` — login form (stores `access_token` or legacy `token` returned by backend)
- `frontend/src/pages/RegisterMultiPhase.js` — registration UI
- `frontend/src/pages/ForgotPassword.js` — request reset token
- `frontend/src/pages/ResetPassword.js` — submit token + new password

## Seed data & tests

- There is a `backend-go/seed` package with scripts used to seed example data. Note: currently the seed package contains duplicate declarations across files which causes `go test ./...` to fail (duplicate `main` and other symbols). To run package tests without seed:

```bash
cd backend-go
go test ./config ./controllers ./database ./middleware ./migrations ./models ./routes
```

If you need to run the full test set or seed executables, clean up duplicate declarations in `backend-go/seed` or run the seed files individually.

## Troubleshooting

- If the backend fails to start because of DB connection issues, verify your MySQL credentials and that the database exists.
- If CORS or proxy issues occur, confirm `FRONTEND_URL`/`PORT` in `backend-go/.env` matches `http://localhost:3000`.
- If login fails, check the payload: `Login` accepts `email` OR `rollNumber` and `password`.

## Useful commands

Start backend (dev):
```bash
cd backend-go
go run main.go
```

Start frontend (dev):
```bash
cd frontend
npm start
```

Run targeted Go package tests (exclude broken `seed` package):
```bash
cd backend-go
go test ./config ./controllers ./database ./middleware ./migrations ./models ./routes
```

Build frontend for production:
```bash
cd frontend
npm run build
```

## Where to look next
- Backend routes: `backend-go/routes/routes.go`
- Auth handlers: `backend-go/controllers/auth.go`
- Frontend API config: `frontend/src/config/api.js`

---
If you want, I can also:
- add a small troubleshooting script to run migrations + seed data,
- or create a Docker Compose file to bring MySQL, backend and frontend up together.


