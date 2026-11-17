# ScholarHub 🎓

Full-stack academic platform for students and faculty to track attendance, manage tasks, coordinate group projects, and communicate seamlessly.

---

## 📁 Project Architecture

The repository is structured as a full-stack monorepo with clean separation between the Java Spring Boot backend and the React Vite frontend:

```
ScholarHub/
├── pom.xml                     # Root Maven aggregator POM
├── mvnw / mvnw.cmd             # Root Maven wrapper scripts
├── package.json                # Root convenience scripts for dev/build
├── .gitignore                  # Monorepo gitignore (build, node, db artifacts)
│
├── backend/                    # Spring Boot 3 + Java 25 REST Backend
│   ├── pom.xml                 # Backend dependencies & plugins
│   ├── mvnw / mvnw.cmd         # Backend Maven wrapper
│   └── src/
│       ├── main/
│       │   ├── java/com/java_project/ScholarHub/
│       │   │   ├── ScholarHubApplication.java # Spring Boot main entry
│       │   │   ├── SecurityConfig.java        # Security, CORS & endpoint policies
│       │   │   ├── DataInitializer.java       # Automatic demo data seeding
│       │   │   ├── Controllers/               # REST API Controllers (Auth, Project, Todo, Subject, Professor)
│       │   │   ├── Models/                    # JPA Entities (User, Project, Todo, Attendance, etc.)
│       │   │   ├── Repositories/              # Spring Data JPA Repositories
│       │   │   ├── Services/                  # Business logic services
│       │   │   └── DTOs/                      # Request & Response payload objects
│       │   └── resources/
│       │       ├── application.properties     # Default H2 persistent embedded DB & config
│       │       └── application-mysql.properties # MySQL profile config
│       └── test/                              # Context and integration tests
│
└── frontend/                   # Modern React 18 + Vite SPA Frontend
    ├── package.json            # Frontend dependencies & scripts
    ├── vite.config.js          # Vite config with /api reverse proxy to backend:8080
    ├── index.html              # HTML5 template
    └── src/
        ├── App.jsx             # Route definitions & layout shell
        ├── components/         # Reusable UI components (Navbar, Sidebar, Modals, etc.)
        ├── context/            # React Context (AppContext, notifications, etc.)
        ├── pages/              # Views (Dashboard, Attendance, Tasks, Projects, etc.)
        ├── services/           # Axios API services (api, auth, attendance, project, task)
        └── styles/             # Modular CSS styles
```

---

## ⚡ Quick Start

### 1. Start the Spring Boot Backend

From the project root:

```bash
# Windows
.\mvnw.cmd spring-boot:run -pl backend

# macOS / Linux
./mvnw spring-boot:run -pl backend
```

> **Note:** The backend uses an embedded H2 database by default (`./data/scholarhub`), so it starts instantly without needing an external MySQL installation. All database tables and demo seed accounts are created automatically.
> 
> To switch to MySQL, start MySQL and run with `--spring.profiles.active=mysql`.

The backend will start on **`http://localhost:8080`**.
- API Base: `http://localhost:8080/api`
- Health check: `http://localhost:8080/api/auth/health`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/scholarhub`, User: `sa`, Password: empty)

---

### 2. Start the React Frontend

Open a second terminal in the project root:

```bash
# Start frontend via root script
npm run dev

# Or directly in frontend folder:
cd frontend
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

---

## 🔑 Pre-seeded Accounts (Out of the Box)

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Student** | `alex.morgan@scholarhub.edu` | `password123` | Subjects, Attendance Records, Todo Boards, Project |
| **Professor** | `dr.vance@scholarhub.edu` | `password123` | Assignments, Announcements |

You can also use the **"Quick Demo Student"** or **"Quick Demo Professor"** buttons on the login page for one-click access.

---

## 🔌 Backend & Frontend Connection Highlights

1. **CORS & Pre-flight Support**: Configured via Spring Security with full support for `http://localhost:5173`, `http://localhost:3000`, and `http://127.0.0.1:5173`.
2. **Vite Reverse Proxy**: Configured in `vite.config.js` to automatically forward `/api` requests to `http://localhost:8080`.
3. **Resilient Data Fallback**: Frontend API client gracefully falls back to local storage if the backend server is temporarily stopped.
4. **Data Seeding**: `DataInitializer` guarantees consistent UUIDs between frontend demo profiles and database records.
