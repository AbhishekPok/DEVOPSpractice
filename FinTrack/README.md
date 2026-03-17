# 💰 FinTrack

FinTrack is a comprehensive financial tracking application designed to help users manage their finances effectively. It features a modern, responsive React frontend and a robust Django backend, fully containerized with Docker for consistent and effortless deployment across any environment.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker Compose (Recommended)](#running-with-docker-compose-recommended)
  - [Running Locally (Without Docker)](#running-locally-without-docker)
- [Environment Variables](#environment-variables)
- [Admin Access](#admin-access)
- [Contributing](#contributing)

---

## ✨ Features

### User Features
- 🔐 **Secure Authentication** — User registration and login with JWT-based authentication.
- 👤 **Profile Management** — Users can update personal details (First Name, Last Name, Email) and view their profile status.
- 📱 **Responsive Design** — A modern UI with a collapsible sidebar, optimized for both desktop and mobile devices.
- 📊 **Financial Dashboard** *(In Progress)* — View transactions, reports, and AI-driven insights.

### Admin Features
- 🛠 **Admin Dashboard** — A dedicated panel for administrators to manage the platform.
- 👥 **User Management** — View a list of all registered users with their details.
- 🔄 **Status Control** — Toggle user accounts between Active and Inactive states.
- 🗑 **User Deletion** — Remove user accounts from the system.
- ➕ **Manual Registration** — Admins can manually register new users via the dashboard.

---

## 🛠 Tech Stack

### Frontend
| Tool | Detail |
|------|--------|
| Framework | React (Vite) |
| Styling | CSS Modules, Vanilla CSS (Green/Emerald Theme) |
| Icons | Lucide React, Tabler Icons |
| Routing | React Router DOM |
| HTTP Client | Axios |

### Backend
| Tool | Detail |
|------|--------|
| Framework | Django |
| API | Django REST Framework (DRF) |
| Authentication | SimpleJWT |
| Database | SQLite (Default) / PostgreSQL (Supported) |

### DevOps
| Tool | Detail |
|------|--------|
| Containerization | Docker |
| Orchestration | Docker Compose |

---

## 📁 Project Structure

```
FinTrack/
├── Backend_new/                  # Django Backend
│   ├── fintrack_backend/         # Main Django Project Directory
│   ├── requirements/             # Python Dependencies
│   └── Dockerfile                # Backend container image
├── Frontend/                     # React Frontend
│   ├── src/
│   │   ├── Pages/                # Page Components (Login, Register, Profile, Admin)
│   │   ├── components/           # Reusable Components (Sidebar, Dashboard)
│   │   └── services/             # API Services (authService)
│   └── Dockerfile                # Frontend container image
├── docker-compose.yml            # Multi-service orchestration
├── .env.example                  # Sample environment variables
└── README.md                     # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites

For Docker (recommended):
- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

For local development (without Docker):
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

---

### Running with Docker Compose (Recommended)

This is the easiest way to get the entire stack — frontend, backend, and database — running with a single command.

**1. Clone the repository**

```bash
git clone <repository-url>
cd FinTrack
```

**2. Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your preferred values
```

**3. Build and start all services**

```bash
docker-compose up --build
```

**4. Run database migrations (first time only)**

```bash
docker-compose exec backend python manage.py migrate
```

**5. Create a superuser for Admin access (first time only)**

```bash
docker-compose exec backend python manage.py createsuperuser
```

**6. Access the application**

| Service      | URL                          |
|--------------|------------------------------|
| Frontend     | http://localhost:5173        |
| Backend API  | http://localhost:8000        |
| Django Admin | http://localhost:8000/admin  |

**7. Stop the services**

```bash
docker-compose down
```

> To stop and remove all volumes (wipes the database): `docker-compose down -v`

---

### Running Locally (Without Docker)

**Backend Setup**

```bash
cd Backend_new

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements/requirements.txt

# Run migrations
cd fintrack_backend
python manage.py migrate

# Create a superuser (for Admin access)
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

Backend runs at `http://localhost:8000`.

**Frontend Setup**

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Django
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL — optional, SQLite used by default)
POSTGRES_DB=fintrack_db
POSTGRES_USER=fintrack_user
POSTGRES_PASSWORD=yourpassword
DATABASE_URL=postgres://fintrack_user:yourpassword@db:5432/fintrack_db

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## 🛡 Admin Access

To access the Admin Dashboard:

1. Log in with your superuser credentials.
   - **Docker:** created via `docker-compose exec backend python manage.py createsuperuser`
   - **Local:** created via `python manage.py createsuperuser`
2. Open the Sidebar in the app.
3. Click on **Admin Panel**.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

---

> Built with ❤️ as part of a DevOps learning journey — containerized for consistency, scalability, and ease of deployment.
