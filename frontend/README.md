# WA-3 React Frontend

A modern, responsive React frontend for the Task Manager REST API (WA-2). Built with React, Vite, and React Router DOM featuring JWT authentication, full CRUD operations, and a sleek dark-themed developer dashboard UI.

---

## Features

- **Full CRUD** — Create, Read, Update, and Delete tasks via REST API
- **JWT Authentication** — Login, Register, token-based session management
- **Protected Routes** — Unauthenticated users are redirected to login
- **Form Validation** — Client-side validation with real-time error feedback
- **Loading States** — Animated spinners during API requests
- **Error Handling** — Friendly messages when the backend is unreachable
- **Empty States** — Clear prompts when no tasks exist
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Modern developer-style dashboard with custom CSS

---

## Tech Stack

| Technology       | Purpose                  |
| ---------------- | ------------------------ |
| React.js         | UI library               |
| Vite             | Build tool / dev server  |
| React Router DOM | Client-side routing      |
| Fetch API        | HTTP requests            |
| CSS              | Styling (custom, no lib) |
| Context API      | Auth state management    |

---

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── TaskCard.jsx
│   │   ├── EmptyState.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── TaskDetails.jsx
│   │   ├── CreateTask.jsx
│   │   ├── EditTask.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useFetch.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## API Configuration

Create a `.env` file in the `frontend/` root:

```env
VITE_API_URL=http://localhost:3000/api
```

> The `.env.example` file is included as a template. Do **not** commit `.env`.

---

## Installation

```bash
cd frontend
npm install
```

---

## Running Locally

```bash
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## Backend Requirement

This frontend requires the WA-2 backend REST API to be running.

Start the backend first:

```bash
cd ../RestAPI    # or wherever your WA-2 backend is
npm start
```

The backend runs at `http://localhost:3000` by default.

---

## Available Routes

| Route         | Page          | Auth Required |
| ------------- | ------------- | ------------- |
| `/`           | Home / Tasks  | ✅ Yes        |
| `/tasks/:id`  | Task Details  | ✅ Yes        |
| `/create`     | Create Task   | ✅ Yes        |
| `/edit/:id`   | Edit Task     | ✅ Yes        |
| `/login`      | Login / Register | ❌ No     |
| `*`           | 404 Not Found | ❌ No         |

---

## API Endpoints

The frontend consumes the following backend endpoints:

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register user     |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/tasks`         | List all tasks    |
| GET    | `/api/tasks/:id`     | Get single task   |
| POST   | `/api/tasks`         | Create a task     |
| PUT    | `/api/tasks/:id`     | Update a task     |
| DELETE | `/api/tasks/:id`     | Delete a task     |

---

## Screenshots

> _Screenshots can be added here after running the application._

---

## Author

Piyush Singh
