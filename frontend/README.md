# Frontend School Administration Portal

React 19 single-page app (Vite + React Router) for managing teachers and classes.

For the full project overview, API reference, and assumptions, see the
[root README](../README.md).

## Prerequisites

- Node.js 18+
- The [backend API](../backend/README.md) running on `http://localhost:5000`

## Setup & running

```bash
npm install
npm run dev      # starts the dev server on http://localhost:5173
```

Then open **http://localhost:5173**.

During development, Vite proxies every `/api/*` request to the backend at
`http://localhost:5000` (see [`vite.config.js`](vite.config.js)), so make sure the
backend is running first.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build a production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## Tests

Tests use **Vitest** and **React Testing Library** (jsdom environment). Coverage
includes the form-validation rules and a Navbar component render test. Run them with:

```bash
npm test
```

## Deployment

Deployed on **Vercel** (root directory `frontend`). The build is a static Vite
bundle and needs **no environment variables**. 
In production, `/api/*` requests are proxied to the backend via [`vercel.json`](vercel.json) — update the destination URL there if the backend host changes. This file is only used by Vercel.
Local dev continues to use the proxy in [`vite.config.js`](vite.config.js).

## Routes

| Path | Screen |
| --- | --- |
| `/teachers` | List of teachers (default route) |
| `/teachers/new` | Add a teacher |
| `/classes` | List of classes |
| `/classes/new` | Add a class |

## Project structure

```
frontend/src/
├── main.jsx              # App entry, router setup
├── App.jsx               # Routes + layout
├── components/
│   └── Navbar.jsx
├── pages/
│   ├── TeachersPage.jsx
│   ├── AddTeacherPage.jsx
│   ├── ClassesPage.jsx
│   └── AddClassPage.jsx
├── api/                  # Fetch helpers + resource clients
│   ├── http.js
│   ├── teachers.js
│   └── classes.js
├── constants/            # Subject and class-level dropdown options
│   ├── subjects.js
│   └── classLevels.js
└── utils/
    └── validation.js     # Client-side form validation
```

## Form validation

- **Email** must be a `@gmail.com` address.
- **Work contact number** must be exactly 8 digits.

See [`src/utils/validation.js`](src/utils/validation.js).
