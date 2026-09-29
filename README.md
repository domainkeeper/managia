# College Club Event Management System

A full-stack responsive web application for managing college club events, registrations, and admin operations.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend  | Node.js, Express, Prisma ORM               |
| Database | PostgreSQL 16 (Docker)                      |
| Auth     | JWT (bcrypt + jsonwebtoken)                 |

## Project Structure

```
college-club-events/
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Environment config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/         # Auth, error handling
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helpers, validators
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       └── seed.js            # Seed data
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   │   └── admin/         # Admin pages
│   │   ├── context/           # React context (auth)
│   │   ├── services/          # API client (Axios)
│   │   └── utils/             # Helpers
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml         # PostgreSQL container
└── package.json               # Root scripts
```

## Quick Start

### Prerequisites

- Node.js >= 20
- Docker Desktop (for PostgreSQL)

### 1. Start PostgreSQL

```bash
# From project root
docker compose up -d
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Run Database Setup

```bash
npm run db:migrate
npm run db:seed
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000

## Development Credentials

> **Admin Login** (change before production!)

| Field    | Value                 |
| -------- | --------------------- |
| Email    | admin@collegeclub.com |
| Password | admin123              |

## API Endpoints

### Public

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/api/events`           | List events (filter)  |
| GET    | `/api/events/featured`  | Get featured event    |
| GET    | `/api/events/categories`| List categories       |
| GET    | `/api/events/:id`       | Get event details     |
| POST   | `/api/events/:id/register` | Register for event |

### Admin (requires Bearer token)

| Method | Endpoint                  | Description        |
| ------ | ------------------------- | ------------------ |
| POST   | `/api/auth/login`         | Admin login        |
| GET    | `/api/auth/me`            | Current admin info |
| POST   | `/api/events`             | Create event       |
| PUT    | `/api/events/:id`         | Update event       |
| DELETE | `/api/events/:id`         | Delete event       |
| GET    | `/api/admin/stats`        | Dashboard stats    |
| GET    | `/api/registrations`      | List registrations |
| GET    | `/api/registrations/:id`  | Registration detail|

## Features

### Student Side
- Browse upcoming events with search, category filter, and sorting
- View event details with status badges
- Register for events with form validation
- Responsive design (mobile, tablet, desktop)

### Admin Side
- JWT-protected dashboard with statistics
- Event CRUD with modal forms
- Toggle featured events
- Registration management with search/filter/sort/pagination
- Responsive admin layout with sidebar

### Event Status (Auto-derived)
- **Registration Open** - event in future, deadline not passed
- **Happening Soon** - starting within 48 hours
- **Registration Closed** - deadline passed
- **Completed** - event date passed

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start both servers                 |
| `npm run server`     | Start backend only                 |
| `npm run client`     | Start frontend only                |
| `npm run db:up`      | Start PostgreSQL container         |
| `npm run db:migrate` | Run Prisma migrations              |
| `npm run db:seed`    | Seed database with sample data     |
| `npm run db:reset`   | Reset + reseed database            |
| `npm run build`      | Build frontend for production      |
