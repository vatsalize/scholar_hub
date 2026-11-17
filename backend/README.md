# ScholarHub Backend & Full-Stack Engine

ScholarHub full-stack platform runner. Starting this backend automatically manages environment health checks, installs all dependencies, compiles the Spring Boot backend, builds the React frontend, and launches the application.

---

## Quickstart (Single Command)

To run the entire full-stack application:

1. Open this directory in your terminal:
   ```bash
   cd backend
   ```
2. Run:
   ```bash
   npm start
   ```
3. Open your browser:
   - **Frontend (React SPA):** [http://localhost:5173](http://localhost:5173) (or [http://localhost:8080](http://localhost:8080))
   - **Backend API & Health:** [http://localhost:8080/api/auth/health](http://localhost:8080/api/auth/health)
   - **H2 Database Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

---

## What Happens Automatically on `npm start`

The `prestart` lifecycle script runs `scripts/setup.js`, which handles all setup steps before launching the servers:

1. **Storage & Environment Check:**
   - Ensures persistent `./data` directory exists for the embedded H2 database.
   - Validates `backend/pom.xml` configuration and Java compiler level.
2. **Frontend Dependency Verification:**
   - Checks `frontend/node_modules`.
   - Runs `npm install` automatically if dependencies are missing or outdated.
3. **Java & Maven Verification:**
   - Ensures Java and the Maven wrapper (`mvnw.cmd` / `mvnw`) are ready.
4. **Frontend Production Build:**
   - Checks `frontend/dist`.
   - Automatically runs `npm run build` if missing or if frontend source code has changed.
5. **Server Boot:**
   - Starts Spring Boot on `http://localhost:8080`.
   - Starts Vite development server on `http://localhost:5173`.
   - Handles clean, graceful shutdown on `Ctrl+C`.

---

## Pre-seeded Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `alex.morgan@scholarhub.edu` | `password123` |
| **Professor** | `dr.vance@scholarhub.edu` | `password123` |
