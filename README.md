Sentinel — Developer Monitoring InfrastructureSentinel is an enterprise-grade uptime, health, and telemetry monitoring platform built for developers and site reliability engineers. It provides real-time service tracking, latency analytics, and automated health checks through a dark-themed telemetry console.🛠️ Tech StackDomainTech / FrameworkKey Libraries & FeaturesFrontendNext.js 14+ (App Router)React, TypeScript, Tailwind CSS, Lucide React, JetBrains Mono / InterBackendFastAPIPython 3.11+, Pydantic v2, SQLAlchemy, Asyncpg, OAuth2 / JWT AuthDatabasePostgreSQLRelational storage for service metrics, check logs, and operator credentialsDevOpsDocker & Docker ComposeMulti-container setup for seamless local development and deployment✨ FeaturesReal-time Telemetry Dashboard: Monitor endpoint status, response latency, and uptime percentages in a high-density console view.Authentication & Role Management: Secure JWT-based authentication flow with user registration and protected API endpoints.Service Health Checkers: Scheduled background checks for HTTP/HTTPS, ping latency, and API availability.Dark Modern UI: Designed specifically for developer workflows using high-contrast dark zinc tones and monospace typography.Dockerized Workflows: One-command setup for backend, database, and frontend services.📁 Repository StructurePlaintext.
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
🚀 Quick Start (Docker)PrerequisitesDocker Desktop or Docker Engine + Docker Compose installed.1. Clone the RepositoryBashgit clone https://github.com/your-username/sentinel.git
cd sentinel
2. Configure Environment VariablesCreate a .env file in the root directory:Code snippet# Backend Environment
PROJECT_NAME=Sentinel
SECRET_KEY=your-super-secret-key-change-this-in-production
DATABASE_URL=postgresql+asyncpg://sentinel:sentinel_pass@db:5432/sentinel_db

# Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
3. Build and RunBashdocker compose up -d --build
Access the services at:Frontend Dashboard: http://localhost:3000FastAPI Backend & Docs: http://localhost:8000/docs💻 Local Development (Manual Setup)If you prefer running services directly without Docker:Backend SetupBashcd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
Frontend SetupBashcd frontend
npm install
npm run dev
🔑 Core API EndpointsMethodEndpointDescriptionAuth RequiredPOST/api/v1/auth/registerRegister a new operator account❌POST/api/v1/auth/loginAuthenticate user and receive access token❌GET/api/v1/monitorsList monitored services and health status✅POST/api/v1/monitorsAdd a new endpoint to monitor✅GET/api/v1/healthSystem telemetry health check❌📄 LicenseThis project is licensed under the MIT License.
