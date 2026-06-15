# Backend — School Administration API

Express 5 REST API backed by PostgreSQL. Handles teachers and classes.

For the full project overview, API reference, and assumptions, see the
[root README](../README.md).

## Prerequisites

- Node.js 18+
- PostgreSQL 13+ running locally

## Setup

```bash
npm install

# Create the database and load the schema
createdb govtech_assignment
psql -d govtech_assignment -f schema.sql

# Configure environment variables
cp .env.example .env   # then edit .env with your DB credentials
```

### Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Port the API listens on | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `govtech_assignment` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |

> `.env` is git-ignored and must never be committed. Use `.env.example` as the template.

## Running

```bash
npm run dev    # nodemon, auto-reloads on change
npm start      # plain node
```

The server listens on `http://localhost:5000` (or `PORT`).

## Tests

```bash
npm test       # runs the Jest suite
```

Tests use **Jest** and **Supertest**. The database pool is mocked, so the suite
runs without a real Postgres connection. Coverage includes the validation rules
and every endpoint (success, validation, not-found, conflict, and error paths).

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/teachers` | Register a teacher |
| `GET`  | `/api/teachers` | List all teachers |
| `POST` | `/api/classes`  | Add a class with a form teacher |
| `GET`  | `/api/classes`  | List all classes |

Errors are returned as `{ "error": "message" }` with an appropriate HTTP status.
See the [root README](../README.md#api-reference) for full request/response examples.

## Project structure

```
backend/
├── src/
│   ├── server.js                       # Entry point: loads env + starts the server
│   ├── app.js                          # Express app (exported for tests)
│   ├── config/
│   │   └── db.js                       # PostgreSQL connection pool
│   ├── routes/
│   │   ├── teacherRoutes.js            # Teacher route definitions
│   │   └── classRoutes.js              # Class route definitions
│   ├── controllers/
│   │   ├── teacherController.js        # Teacher request handlers
│   │   └── classController.js          # Class request handlers
│   └── utils/
│       └── validation.js               # Request-body validation
├── tests/                              # Jest + Supertest tests
├── schema.sql                          # Database schema
└── .env.example                        # Environment variable template
```
