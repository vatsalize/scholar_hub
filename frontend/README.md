# Scholar Hub – 3-in-1 Academic Management Platform (Frontend)

Scholar Hub is a modern, professional SaaS academic management web application built for college students. It unites three core academic workflows into a single dashboard:

1. **Attendance Management** (Class tracking, safe-bunk / shortfall calculator, 75% threshold monitoring, lecture log)
2. **Task Management** (Interactive Kanban board, priority badges, due dates, course categorization)
3. **Real-Time Project Collaboration** (Team workspaces, milestone deliverables, real-time simulated discussion feeds, member management)

Along with an integrated **Academic Calendar**, **Notifications System**, **Student Settings**, and an **Authentication System** with route guards.

---

## 🔐 Authentication System

The application features a complete authentication system with protected routes and state persistence:

- **Login (`/login`)**:
  - Email & password validation with show/hide password toggle.
  - "Remember me" option to persist email across sessions.
  - 1-click **Demo Autofill** button for immediate evaluation.
  - Link to Forgot Password and Registration.
- **Registration (`/register`)**:
  - Full student profile fields: Full Name, Institutional Email, Student ID, College/University, Department, Semester, Password, and Password Confirmation.
  - Password matching and minimum character validations.
  - Automatically logs in the new student and populates the dashboard with their registered name.
- **Forgot Password (`/forgot-password`)**:
  - Validates registered email and provides visual reset link confirmation.
- **Route Protection**:
  - Unauthenticated access to dashboard routes (`/dashboard`, `/attendance`, `/tasks`, `/projects`, etc.) automatically redirects to `/login`.
  - Authenticated visits to `/login` or `/register` automatically redirect to `/dashboard`.
- **Sign Out**:
  - Accessible via both the top navigation bar profile dropdown and the bottom of the sidebar.

> **Note**: For initial frontend demonstration and offline testing, user sessions and accounts are persisted via `localStorage` with a fallback simulation. This is separated in `src/services/authService.js` and ready to connect to your Java Spring Boot `/api/auth` endpoints.

### Default Demo Account Credentials

| Field | Value |
|---|---|
| **Email** | `alex.morgan@scholarhub.edu` |
| **Password** | `password123` |

*(You can also click the **Autofill** button on the Login page or create your own custom account via the Sign Up page)*.

---

## 🛠️ Technology Stack

- **Core Framework**: React.js 18 + Vite
- **Language**: JavaScript (ES6+)
- **Routing**: React Router DOM (v6) with Protected & Public Route guards
- **Styling**: Pure Modular CSS with a custom SaaS design system (Notion / Linear aesthetics). *No Tailwind, No Bootstrap*.
- **Icons**: Lucide React
- **Charts & Visualizations**: Recharts
- **API Client**: Axios

---

## 🚀 Getting Started

### Installation & Launch

1. Open your terminal and navigate to the frontend folder:
   ```bash
   cd scholar-hub-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. The application will be live at:
   ```
   http://localhost:5173
   ```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
scholar-hub-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ChartCard.jsx          # Recharts responsive card container
│   │   ├── Modal.jsx              # Universal accessible modal dialog
│   │   ├── Navbar.jsx             # Top sticky navbar with user menu & logout
│   │   ├── ProjectCard.jsx        # Collaborative project card
│   │   ├── ProtectedRoute.jsx     # Route guard redirecting unauthenticated users to /login
│   │   ├── PublicRoute.jsx        # Route guard redirecting authenticated users to /dashboard
│   │   ├── Sidebar.jsx            # Collapsible navigation sidebar with logout trigger
│   │   ├── StatCard.jsx           # Metric KPI card with trend & target
│   │   └── TaskCard.jsx           # Kanban task card with quick actions
│   ├── context/
│   │   └── AppContext.jsx         # Global state, auth session & toast alerts
│   ├── data/
│   │   └── dummyData.js           # Realistic initial CS student academic data
│   ├── pages/
│   │   ├── Attendance.jsx         # Subject cards, advice calculator, lecture logs
│   │   ├── Calendar.jsx           # Interactive monthly agenda & event scheduling
│   │   ├── Dashboard.jsx          # Main overview, charts, deadlines, activity feed
│   │   ├── ForgotPassword.jsx     # Password reset request with email verification
│   │   ├── Login.jsx              # Sign-in page with validations & demo helper
│   │   ├── Notifications.jsx     # Filterable notifications feed & read actions
│   │   ├── ProjectDetails.jsx     # Deep workspace with tasks, discussion & timeline
│   │   ├── Projects.jsx           # Projects grid & creation modal
│   │   ├── Register.jsx           # Student account registration with all academic fields
│   │   ├── Settings.jsx           # Profile, attendance criteria, and preferences
│   │   └── Tasks.jsx              # 3-column Kanban board & List view
│   ├── services/
│   │   ├── api.js                 # Central Axios client & Spring Boot configuration
│   │   ├── authService.js         # Authentication, session tokens & registration API
│   │   ├── attendanceService.js   # Attendance & Subject CRUD API methods
│   │   ├── calendarService.js     # Calendar events API methods
│   │   ├── notificationService.js # Notification and alerts API methods
│   │   ├── projectService.js      # Team collaboration & project tasks API methods
│   │   └── taskService.js         # Kanban tasks & todo API methods
│   ├── styles/
│   │   ├── Attendance.css
│   │   ├── Auth.css               # Styling for Login, Register & Forgot Password
│   │   ├── Calendar.css
│   │   ├── Components.css
│   │   ├── Dashboard.css
│   │   ├── Modal.css
│   │   ├── Navbar.css
│   │   ├── Notifications.css
│   │   ├── ProjectDetails.css
│   │   ├── Projects.css
│   │   ├── Settings.css
│   │   ├── Sidebar.css
│   │   ├── Tasks.css
│   │   └── global.css
│   ├── App.jsx                    # Router, route guards and shell layout
│   └── main.jsx                   # React root renderer
├── index.html                     # HTML template with Google Fonts (Plus Jakarta Sans)
├── package.json                   # Project dependencies & scripts
├── vite.config.js                 # Vite bundler configuration
└── README.md                      # Project documentation
```

---

## 🔌 Spring Boot Backend Integration Guide

The frontend is architected to integrate seamlessly with the Java Spring Boot backend located in the parent repository.

### Configuration

The backend base URL is configured in `src/services/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Target Spring Boot Endpoints

| Domain | Spring Boot Controller | Endpoint | Method | Purpose |
|---|---|---|---|---|
| **Auth** | `AuthController` | `/api/auth/login` | `POST` | Authenticate student credentials & return JWT |
| | | `/api/auth/register` | `POST` | Create student account |
| | | `/api/auth/forgot-password` | `POST` | Request password reset token |
| | | `/api/auth/verify-otp` | `POST` | Two-factor / OTP verification |
| **Subjects** | `SubjectNewController` | `/api/subjectNew/getAll/{userId}` | `GET` | Fetch all enrolled subjects & attendance |
| | | `/api/subjectNew/add/{userId}/{subjectName}` | `POST` | Register a new subject |
| | | `/api/subjectNew/delete/{subjectId}` | `DELETE` | Remove an enrolled subject |
| | | `/api/subjectNew/update` | `PUT` | Batch update attendance counts |
| **Tasks** | `TodoController` | `/api/todo/task/getAll/{userId}` | `GET` | Fetch user's tasks |
| | | `/api/todo/task/add` | `POST` | Create a new task |
| | | `/api/todo/task/delete/{taskId}` | `DELETE` | Delete a task |
| **Projects** | `ProjectController` | `/api/project/getAll` | `GET` | Fetch all project workspaces |
| | | `/api/project/create` | `POST` | Create a new project workspace |
| | | `/api/project/tasks/add` | `POST` | Add deliverable task to project |
