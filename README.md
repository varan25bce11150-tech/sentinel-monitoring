# Sentinel — Developer Monitoring Infrastructure

Sentinel is an enterprise-grade uptime, health, and telemetry monitoring platform built for developers and site reliability engineers. It provides real-time service tracking, latency analytics, and automated health checks through a dark-themed telemetry console.

---

## 🛠️ Tech Stack

| Domain       | Tech / Framework         | Key Libraries & Features                                             |
| :----------- | :----------------------- | :------------------------------------------------------------------ |
| **Frontend** | Next.js 14+ (App Router) | React, TypeScript, Tailwind CSS, Lucide React, JetBrains Mono / Inter |
| **Backend**  | FastAPI                  | Python 3.11+, Pydantic v2, SQLAlchemy, Asyncpg, OAuth2 / JWT Auth   |
| **Database** | PostgreSQL               | Relational storage for service metrics, check logs, and credentials |
| **DevOps**   | Docker & Docker Compose  | Multi-container setup for local development and deployment          |

---

## ✨ Features

- **Real-time Telemetry Dashboard:** Monitor endpoint status, response latency, and uptime percentages in a high-density console view.
- **Authentication & Role Management:** Secure JWT-based authentication flow with user registration and protected API endpoints.
- **Service Health Checkers:** Scheduled background checks for HTTP/HTTPS, ping latency, and API availability.
- **Dark Modern UI:** Designed specifically for developer workflows using high-contrast dark zinc tones and monospace typography.
- **Dockerized Workflows:** One-command setup for backend, database, and frontend services.

---

## 📁 Repository Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers (auth, monitors, health)
│   │   ├── core/         # Config, security, database sessions
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router (login, register, dashboard)
│   │   └── lib/          # API helpers and client utilities
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start (Docker)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine + Docker Compose installed.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/sentinel.git](https://github.com/your-username/sentinel.git)
cd sentinel
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Environment
PROJECT_NAME=Sentinel
SECRET_KEY=your-super-secret-key-change-this-in-production
DATABASE_URL=postgresql+asyncpg://sentinel:sentinel_pass@db:5432/sentinel_db

# Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Build and Run

```bash
docker compose up -d --build
```

Access the services at:
- **Frontend Dashboard:** `http://localhost:3000`
- **FastAPI Backend & Docs:** `http://localhost:8000/docs`

---

## 💻 Local Development (Manual Setup)

If you prefer running services directly without Docker:

### Backend Setup

```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Core API Endpoints

| Method | Endpoint                | Description                                | Auth Required |
| :----- | :---------------------- | :----------------------------------------- | :-----------: |
| `POST` | `/api/v1/auth/register` | Register a new operator account            |      ❌       |
| `POST` | `/api/v1/auth/login`    | Authenticate user and receive access token |      ❌       |
| `GET`  | `/api/v1/monitors`      | List monitored services and health status  |      ✅       |
| `POST` | `/api/v1/monitors`      | Add a new endpoint to monitor              |      ✅       |
| `GET`  | `/api/v1/health`        | System telemetry health check              |      ❌       |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
