# School Administration Portal

A full-stack application that lets administrators of a private education business
register teachers and create classes (each with an assigned form teacher).

- **Frontend:** React 19 + Vite + React Router
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL

```
govtechfullstackassignment/
├── backend/      # Express API server
├── frontend/     # React single-page app
└── README.md     # You are here
```

---

## Live demo

- **Web app (Vercel):** https://YOUR-APP.vercel.app
- **API (Render):** https://govtechfullstackassignment.onrender.com

> Hosted on free tiers, so the **first request after a period of inactivity may take
> ~30 seconds** while the backend and database wake from sleep. Subsequent requests
are fast.

---

## Features

| User story | Screen | API |
| --- | --- | --- |
| Register a teacher | Add Teacher | `POST /api/teachers` |
| List teachers | Teachers | `GET /api/teachers` |
| Add a class with a form teacher | Add Class | `POST /api/classes` |
| List classes | Classes | `GET /api/classes` |

---

## Prerequisites

- **Node.js** 18 or newer (Express 5 requires it)
- **npm** (ships with Node)
- **PostgreSQL** 13 or newer, running locally

---

## Getting started

The app has two parts the **backend API** and the **frontend SPA** that run in
two separate terminals. 
Set up the database first, then the backend, then the frontend.

### 1. Database

Create a database and load the schema:

```bash
# Create the database (adjust the user if needed)
createdb govtech_assignment

# Load the tables
psql -d govtech_assignment -f backend/schema.sql
```

This creates two tables: `teachers` and `classes`. See
[`backend/schema.sql`](backend/schema.sql) for details.

### 2. Backend

```bash
cd backend
npm install

# Create your environment file from the template and fill in your DB password
cp .env.example .env

npm run dev      # start on http://localhost:5000 with auto-reload
# or: npm start  
```

Required environment variables (see [`backend/.env.example`](backend/.env.example)):

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | Port the API listens on | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `govtech_assignment` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev      # start on http://localhost:5173
```

Open **http://localhost:5173** in your browser. Vite proxies all `/api/*` requests
to the backend at `http://localhost:5000` (configured in
[`frontend/vite.config.js`](frontend/vite.config.js)), so no extra CORS setup is
needed in development.

---

## Tests

Both sides have unit tests that run without any external services.

```bash
# Backend: Jest + Supertest (database pool is mocked)
cd backend && npm test

# Frontend: Vitest + React Testing Library
cd frontend && npm test
```

The backend suite covers validation and every endpoint (success, validation,
not-found, conflict, and server-error paths). The frontend suite covers the
form-validation rules and a component render test.

---

## API reference

Base path: `/api`. All request and response bodies are JSON.

### `POST /api/teachers` —> Register a teacher

Request:

```json
{
  "name": "Mary",
  "subject": "Mathematics",
  "email": "teachermary@gmail.com",
  "contactNumber": "68129414"
}
```

Success: `201 Created`.

### `GET /api/teachers` —> List teachers

Success: `200 OK`.

```json
{
  "data": [
    {
      "name": "Mary",
      "subject": "Mathematics",
      "email": "teachermary@gmail.com",
      "contactNumber": "68129414"
    }
  ]
}
```

### `POST /api/classes` —> Add a class

Request:

```json
{
  "level": "Primary 1",
  "name": "Class 1A",
  "teacherEmail": "teachermary@gmail.com"
}
```

Success: `201 Created`.

### `GET /api/classes` —> List classes

Success: `200 OK`.

```json
{
  "data": [
    {
      "level": "Primary 1",
      "name": "Class 1A",
      "formTeacher": { "name": "Mary" }
    }
  ]
}
```

### Error responses

Every error returns an appropriate HTTP status and a JSON body of the form:

```json
{ "error": "Some meaningful error message" }
```

| Status | When |
| --- | --- |
| `400 Bad Request` | A required field is missing |
| `404 Not Found` | `teacherEmail` does not match any teacher (creating a class) |
| `409 Conflict` | Duplicate teacher email, or the teacher is already a form teacher of another class |
| `500 Internal Server Error` | Unexpected server/database error |

---

## Assumptions

- **No authentication or access control** is implemented, as stated in the brief.
- **A teacher can be the form teacher of only one class.** This is enforced at the
  database level with a `UNIQUE` constraint on `classes.form_teacher_id`.
- **Teacher email is unique** and is used as the public identifier for a teacher
  (the internal numeric `id` is never exposed in API responses).
- **Validation rules** applied on the Add Teacher form:
  - Email must be a `@gmail.com` address.
  - Work contact number must be exactly 8 digits.
- **Subjects and class levels are fixed lists** chosen from dropdowns rather than
  free text, to keep data consistent (see
  [`frontend/src/constants/`](frontend/src/constants/)).
- **A form teacher must already exist** before a class can be assigned to them; the
  Add Class screen links to the Add Teacher screen when none exist.
- Deleting a teacher who is a form teacher is blocked at the DB level
  (`ON DELETE RESTRICT`).

---

## Deployment

The app is deployed across three services, all from this **single repository**:

| Part | Platform | Configuration |
| --- | --- | --- |
| Frontend | **Vercel** | Root directory `frontend`. `/api/*` requests are proxied to the API via [`frontend/vercel.json`](frontend/vercel.json), so no CORS setup is needed. |
| Backend | **Render** | Root directory `backend`. Start command `npm start`. `DATABASE_URL` set as an environment variable. |
| Database | **Neon** | Managed PostgreSQL. Schema loaded once from [`backend/schema.sql`](backend/schema.sql). |

Local development is unaffected by the hosting config: when running locally, the
frontend uses the dev proxy in [`frontend/vite.config.js`](frontend/vite.config.js)
(`vercel.json` is only read by Vercel in production).

---

## Tech notes

- The frontend and backend are both written in **JavaScript** (single language
  across the stack, per the brief).
- Server-side responses never leak internal database columns — controllers map rows
  to the exact response shape specified by the API.
