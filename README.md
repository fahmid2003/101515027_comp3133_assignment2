# 🏢 EmpTrack — COMP 3133 Assignment 2

**Student:** [Al Shahriar Fahmid] | **Student ID:** [101515027]
**Course:** COMP 3133 — Full Stack Development | **College:** George Brown College

---

## 📋 Project Overview

A full-stack Employee Management System built with:

- **Backend:** Node.js + Express + Apollo GraphQL + MongoDB
- **Frontend:** Angular 16 + Angular Material + Apollo Angular
- **DevOps:** Docker + Docker Compose

---

## 🚀 Getting Started


# Build & start all services
docker-compose up --build

# Services:
# Frontend:      http://localhost:4200
# Backend:       http://localhost:5000/graphql
# Mongo Express: http://localhost:8081  (admin / admin123)
```

### Option 2: Run Locally

**Backend:**
```bash
cd backend
cp .env.example .env          # Edit with your MongoDB URI
npm install
npm run dev                   # Starts on port 5000
```

**Frontend:**
```bash
cd frontend
npm install
ng serve                      # Starts on port 4200
```

---

## 🔑 GraphQL API Reference

### Queries

| Query | Auth Required | Description |
|-------|:---:|-------------|
| `login(username, password)` | ❌ | Returns JWT token + user |
| `getAllEmployees` | ✅ | All employee records |
| `searchEmployeeByEid(eid)` | ✅ | Single employee by ID |
| `searchEmployeeByDepartment(department)` | ✅ | Filter by department |
| `searchEmployeeByDesignation(designation)` | ✅ | Filter by designation |

### Mutations

| Mutation | Auth Required | Description |
|----------|:---:|-------------|
| `signup(username, email, password)` | ❌ | Create user account |
| `addEmployee(input)` | ✅ | Create new employee |
| `updateEmployee(eid, input)` | ✅ | Update employee by ID |
| `deleteEmployee(eid)` | ✅ | Delete employee by ID |

### File Upload (REST)

```
POST /api/upload
Content-Type: multipart/form-data
Body: { photo: <image file> }
Response: { url: "http://...", filename: "..." }
```

### Example GraphQL Queries (Postman / Apollo Studio)

```graphql
# Signup
mutation {
  signup(username: "admin", email: "admin@test.com", password: "secret123") {
    _id
    username
    email
  }
}

# Login
query {
  login(username: "admin", password: "secret123") {
    token
    user { _id username email }
  }
}

# Add Employee (requires Bearer token in header)
mutation {
  addEmployee(input: {
    first_name: "Jane"
    last_name: "Doe"
    email: "jane.doe@company.com"
    gender: "Female"
    salary: 85000
    date_of_joining: "2024-01-15T00:00:00.000Z"
    department: "Engineering"
    designation: "Software Engineer"
  }) {
    _id
    first_name
    department
  }
}
```

---

## 🎨 Features Implemented

| # | Feature | Status |
|---|---------|:------:|
| 1 | User Signup with validation | ✅ |
| 2 | User Login with JWT | ✅ |
| 3 | Auth Guard (protected routes) | ✅ |
| 4 | Session token via AuthService | ✅ |
| 5 | Employee List (paginated table) | ✅ |
| 6 | Add Employee with photo upload | ✅ |
| 7 | View Employee details | ✅ |
| 8 | Edit Employee with photo update | ✅ |
| 9 | Delete Employee (confirm dialog) | ✅ |
| 10 | Search by Department | ✅ |
| 11 | Search by Designation/Position | ✅ |
| 12 | Angular Material UI | ✅ |
| 13 | Custom `salaryCurrency` Pipe | ✅ |
| 14 | Reactive Forms + validation | ✅ |
| 15 | Lazy-loaded feature modules | ✅ |
| 16 | Responsive design | ✅ |
| 17 | Docker Compose | ✅ |
| 18 | Logout & session clear | ✅ |

---

## ☁️ Deployment

### Vercel (Frontend)
```bash
cd frontend
npm run build:prod
# Deploy dist/ folder to Vercel
```

### Render (Backend)
1. Connect your GitHub repo to [render.com](https://render.com)
2. Set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add environment variables (MONGO_URI, JWT_SECRET, FRONTEND_URL)

### MongoDB Atlas (Database)
1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string and update `MONGO_URI` env variable

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Angular 16 |
| UI Components | Angular Material |
| GraphQL Client | Apollo Angular |
| Backend Runtime | Node.js + Express |
| GraphQL Server | Apollo Server Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| File Upload | Multer |
| Containerization | Docker + Docker Compose |

---

## 👨‍💻 Author

**[Al Shahriar Fahmid]** — [fahmid.alshahriar21@gmail.com]
GitHub: [https://github.com/fahmid2003]

---

*COMP 3133 — Full Stack Development II | George Brown College | Winter 2026*
