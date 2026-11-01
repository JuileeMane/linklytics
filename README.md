# LinkLytics — Advanced URL Shortener & Real-Time Link Analytics Platform

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.2-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-v5-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

**LinkLytics** is a full-stack link shortening and web analytics engine built as a B.Tech Computer Science mini-project. It showcases enterprise Java backend architecture, REST APIs, PostgreSQL relational data persistence, Spring Security with stateless JWT, and a SaaS UI engineered in React with Material UI and Recharts.

---

## 🌟 Key Features

- **Base62 URL Shortening**: High-throughput collision-resistant short code generation with support for custom vanity aliases.
- **Real-Time Click Tracking**: Every short link redirect logs visitor timestamp, device type (Desktop, Mobile, Tablet), operating system, browser engine, referral domain, and geographic origin.
- **Visual Analytics Dashboard**: Interactive 30-day click activity area charts, device distribution donuts, browser performance bars, and live redirect streams using Recharts.
- **Local QR Code Studio**: Instant client and server QR code generation powered by local ZXing — zero paid third-party API dependencies or subscriptions.
- **Link Organization**: Group shortened links into color-coded folders, custom multi-tag buckets, and unified marketing campaigns.
- **Security & Access Control**: BCrypt-hashed password protection for confidential links, configurable link expiration dates, and role-based permissions (`ROLE_USER` and `ROLE_ADMIN`).
- **UTM Campaign Builder**: Interactive builder supporting `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content` with 1-click short link generation.
- **One-Click CSV Export**: Stream link performance logs and historical metrics to CSV using Apache Commons CSV.
- **Admin Governance Console**: Platform administrators can inspect global user growth, toggle account access, detect high-velocity suspicious links, and delete abusive targets.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Material UI (MUI v5), React Router DOM v6, Axios, Recharts, Lucide React, Canvas Confetti |
| **Backend** | Java 17, Spring Boot 3.3.2, Spring Security 6, Spring Data JPA, Hibernate ORM, Lombok |
| **Database** | PostgreSQL 16 (Primary Production & Dev Database), HikariCP Connection Pooling |
| **Security** | Stateless JWT (JJWT 0.12.5), BCrypt Password Hashing, CORS Configuration |
| **Documentation** | Springdoc OpenAPI 2.5.0, Swagger UI 5.13.0 |
| **Testing** | JUnit 5, Mockito, Spring Boot Test |

---

## 🚀 Quick Start (Local Windows Running)

### Prerequisites

1. **Java JDK 17 or higher** (`java -version`)
2. **Node.js v18 or higher** (`node -v`)
3. **PostgreSQL Database** (Local instance or free cloud database via [Neon.tech](https://neon.tech))

---

### Step 1: Set Up the Database

You can use either a local PostgreSQL database or a free Neon Cloud PostgreSQL instance.

#### Option A: Free Cloud PostgreSQL via Neon (Recommended — 0 Install)
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a project named `linklytics`.
3. Copy your database connection string:
   ```
   postgres://username:password@ep-xyz.us-east-2.aws.neon.tech/linklytics?sslmode=require
   ```
4. Convert it to a JDBC connection string:
   ```
   jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/linklytics?sslmode=require
   ```

#### Option B: Local PostgreSQL (or Docker)
If you have Docker installed, simply run:
```powershell
docker-compose up -d
```
Or create a local database in `psql`:
```sql
CREATE DATABASE linklytics;
```

---

### Step 2: Configure Environment Variables

Copy `.env.example` or set your environment variables in PowerShell:

```powershell
# In PowerShell:
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/linklytics"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgrespassword"
$env:JWT_SECRET="linklyticsSuperSecretKeyForJwtSigningMustBeAtLeast256BitsLong2026LinkLyticsBTechProject"
$env:APP_BASE_URL="http://localhost:8080"
```

---

### Step 3: Run the Spring Boot Backend

From the project root:

```powershell
cd D:\LinkLytics\backend
.\mvnw.cmd spring-boot:run
```

The backend server starts at: **`http://localhost:8080`**  
OpenAPI / Swagger UI is live at: **`http://localhost:8080/swagger-ui/index.html`**  
Health Check endpoint: **`http://localhost:8080/api/health`**

> **Note on Initial Data**: On first startup, the application's `DataInitializer` automatically creates:
> - **Demo User**: `demo@linklytics.com` | Password: `Demo@123` (seeded with 5 sample links and 600+ historical clicks!)
> - **Admin User**: `admin@linklytics.com` | Password: `Admin@123`

---

### Step 4: Run the React Frontend

Open a new PowerShell terminal:

```powershell
cd D:\LinkLytics\frontend
npm.cmd run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🎯 Evaluator / Teacher Demonstration Sequence

1. **Landing Page**:
   - Open `http://localhost:5173`.
   - Point out responsive hero typography, quick shortener bar, interactive features grid, and the theme switcher (light/dark mode toggle).
2. **Demo Quick-Fill Sign In**:
   - Click **Log In**.
   - Click the **"Fill Demo User"** button (`demo@linklytics.com` / `Demo@123`) for instantaneous login without manual typing.
3. **Interactive Dashboard**:
   - Show aggregate KPI cards (Total Links, Clicks, Unique Visitors, Active Links).
   - Point to the 30-day Click Trends AreaChart and Device Distribution Donut Chart rendered via Recharts.
   - Point out the real-time click stream showing browsers, operating systems, and referrers.
4. **URL Shortening & Confetti**:
   - Paste any destination URL into the Quick Shortener or click **Create Link**.
   - Set a custom alias e.g. `teacher-demo`.
   - Click **Create Link** — notice the celebration confetti and instant short URL copy.
5. **Live Click & Redirection**:
   - Open a new incognito window or paste `http://localhost:8080/r/teacher-demo`.
   - Show how the backend handles HTTP 302 redirect, parses the User-Agent, hashes the IP visitor for privacy, increments the counter in PostgreSQL, and forwards the browser.
   - Return to the dashboard and click **Refresh** — watch the total clicks increase in real time!
6. **QR Code Studio**:
   - Open **QR Studio** from the sidebar.
   - Demonstrate the resolution slider and PNG download generated locally by ZXing.
7. **Folders, Tags & Campaigns**:
   - Show folder organization, multi-tag filtering, and marketing campaign performance aggregation.
8. **Admin Console**:
   - Log out and click **"Fill Admin User"** (`admin@linklytics.com` / `Admin@123`).
   - Navigate to **Admin Console** to display platform-wide metrics, user account status toggle, and suspicious link monitoring.
9. **Swagger REST Documentation**:
   - Open `http://localhost:8080/swagger-ui/index.html` to demonstrate the OpenAPI 3.0 specification and interactive test runner.

---

## 🌐 Public Live Deployment Guide

LinkLytics is structured for deployment on free-tier cloud platforms:

### 1. Database: Neon PostgreSQL
- Create a free database at [Neon.tech](https://neon.tech).
- Obtain the pooled JDBC connection URL.

### 2. Backend: Render Web Service
- Connect your GitHub repository to [Render.com](https://render.com).
- Create a **Web Service** with:
  - **Runtime**: `Java`
  - **Build Command**: `./mvnw clean package -DskipTests`
  - **Start Command**: `java -jar target/linklytics-backend-1.0.0.jar`
  - **Environment Variables**:
    - `PORT`: `10000`
    - `SPRING_DATASOURCE_URL`: *(Your Neon JDBC connection string)*
    - `SPRING_DATASOURCE_USERNAME`: *(Your Neon DB username)*
    - `SPRING_DATASOURCE_PASSWORD`: *(Your Neon DB password)*
    - `JWT_SECRET`: *(A 256-bit secret key)*
    - `APP_BASE_URL`: `https://your-service.onrender.com`
    - `FRONTEND_URL`: `https://your-app.vercel.app`
    - `CORS_ALLOWED_ORIGINS`: `https://your-app.vercel.app`

### 3. Frontend: Vercel Static Hosting
- Connect your repository to [Vercel](https://vercel.com).
- Set root directory to `frontend`.
- Add environment variable:
  - `VITE_BACKEND_URL`: `https://your-service.onrender.com`
- Deploy!

---

## 📁 Repository Structure

```
LinkLytics/
├── backend/                  # Java 17 & Spring Boot REST API
│   ├── src/main/java/com/linklytics/
│   │   ├── config/           # Security, OpenAPI, and Data Seeding
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Request & Response Contracts
│   │   ├── entity/           # JPA Entities (User, Link, ClickEvent, etc.)
│   │   ├── exception/        # Global Exception Handler
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   ├── security/         # JWT Provider & Auth Filters
│   │   ├── service/          # Business Logic & QR Generation
│   │   └── util/             # Base62 & User-Agent Parsing
│   ├── src/main/resources/   # YAML configuration
│   ├── src/test/             # Unit and Integration test suite
│   ├── pom.xml               # Maven configuration
│   └── mvnw.cmd              # Windows Maven wrapper
│
├── frontend/                 # React 18 & Vite Web Application
│   ├── src/
│   │   ├── assets/           # Logos and branding assets
│   │   ├── components/       # Common, Analytics, and Link components
│   │   ├── context/          # Auth & Theme context providers
│   │   ├── layouts/          # Dashboard and Public layouts
│   │   ├── pages/            # 14 Full Application Pages
│   │   ├── services/         # Axios API service clients
│   │   ├── theme/            # Material UI Light & Dark themes
│   │   ├── App.jsx           # App Routes
│   │   └── main.jsx          # React DOM entrypoint
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── docs/                     # College Presentation Documentation
│   ├── PROJECT_ABSTRACT.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   ├── TESTING_REPORT.md
│   └── VIVA_PREPARATION.md
│
├── docker-compose.yml        # One-click PostgreSQL container
├── render.yaml               # Render Cloud deployment blueprint
├── .env.example              # Environment variable documentation
└── README.md                 # Project guide
```

---

## 📜 License & Academic Integrity

Developed for academic presentation and software engineering coursework. Released under the Apache 2.0 License.
