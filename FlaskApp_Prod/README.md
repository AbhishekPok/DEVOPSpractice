# 🐳 Two-Tier Flask App — DevOps Learning Project

A personal learning project to understand Docker containerization, multi-stage builds, and AWS deployment using a simple Flask + MySQL two-tier application.

---

## 📌 Original Source

This project is based on the original repository by **Shubham Londhe**:

🔗 https://github.com/LondheShubham153/two-tier-flask-app

---

## 🔄 Changes Made from Original

| # | Change | Why |
|---|---|---|
| 1 | **Multistage Dockerfile** | Reduced image size from ~450MB to ~200MB |
| 2 | **Gunicorn instead of Flask dev server** | Production grade WSGI server, no debug mode |
| 3 | **Production docker-compose** | Added healthchecks, restart policy, resource limits, volumes, logging |
| 4 | **Fixed init_db() for Gunicorn** | Moved outside `if __name__ == '__main__'` so table is created when Gunicorn starts |
| 5 | **Added .env support** | Keeps secrets out of Dockerfile and compose file |

### Original vs Modified

```
Original                        Modified
────────────────────            ────────────────────
Single stage Dockerfile         Multistage Dockerfile
python3 app.py (dev server)     Gunicorn (prod server)
Basic docker-compose            Production grade compose
init_db() in main block         init_db() outside main
No .env file                    .env for all secrets
```

---

## 📁 Project Structure

```
two-tier-flask-app/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile             # Multistage Dockerfile
├── docker-compose.yml     # Production compose file
├── message.sql            # DB init script
├── templates/             # HTML frontend
├── .env                   # Environment variables (never commit!)
└── README.md
```

---

## 🏗️ Architecture

```
Browser
   │
   ▼
┌─────────────────────────────┐
│        Docker Network       │
│                             │
│  ┌──────────────────────┐   │
│  │   Flask App (Web)    │   │
│  │   Gunicorn :5000     │   │
│  └──────────┬───────────┘   │
│             │               │
│  ┌──────────▼───────────┐   │
│  │   MySQL Database     │   │
│  │   mysql:8.4 :3306    │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

---

## ⚙️ Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Docker | 24+ | Container runtime |
| Docker Compose | 2.0+ | Multi-container orchestration |
| AWS CLI | 2.0+ | AWS deployment |
| Git | Any | Clone repository |

### Install Docker (Ubuntu)
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🚀 Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/LondheShubham153/two-tier-flask-app.git
cd two-tier-flask-app
```

### 2. Create .env File
```bash
vi .env
```
```env
# MySQL Container
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=appdb
MYSQL_USER=appuser
MYSQL_PASSWORD=apppass

# Flask App
MYSQL_HOST=db
MYSQL_DB=appdb
```

### 3. Run with Docker Compose
```bash
docker compose up -d --build
```

### 4. Access Application
```
http://<your-ip>:5000
```

---

## 🐳 Docker Setup

### Multistage Dockerfile

```
Stage 1 (Builder)          Stage 2 (Runner)
─────────────────          ─────────────────
python:3.11 (full)         python:3.11-slim
Install build tools        Runtime libs only
Compile packages      ───▶ Copy compiled packages
                           Run with Gunicorn
```

### Why Multistage?
```
Single stage image   → ~450MB  ❌
Multistage image     → ~200MB  ✅
```

---

## 🐳 Docker Commands

### Build & Run
```bash
# Build and start all containers
docker compose up -d --build

# Start without rebuilding
docker compose up -d

# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

### Monitoring
```bash
# Check running containers
docker ps

# View Flask logs
docker logs -f flask-app-web-1

# View MySQL logs
docker logs -f flask-app-db-1

# Watch container health
watch docker ps
```

### Debugging
```bash
# Enter Flask container
docker exec -it flask-app-web-1 /bin/sh

# Enter MySQL container
docker exec -it flask-app-db-1 mysql -u appuser -p appdb

# Inspect network
docker network inspect flask-app_appnet

# Check volumes
docker volume ls
```

### Cleanup
```bash
# Remove all containers
docker rm -f $(docker ps -aq)

# Remove all images
docker rmi -f $(docker images -q)

# Remove all volumes
docker volume prune -f

# Nuclear cleanup
docker system prune -a -f --volumes
```

---

## ☁️ AWS Deployment

### Architecture
```
Developer
    │ docker build & push
    ▼
┌─────────────┐
│  Amazon ECR │  ← Container Registry
└──────┬──────┘
       │ pull image
       ▼
┌─────────────────────────────────────┐
│              AWS VPC                │
│                                     │
│  Public Subnet      Private Subnet  │
│  ┌──────────┐       ┌───────────┐   │
│  │   ALB    │──────▶│  ECS      │   │
│  └──────────┘       │  Fargate  │   │
│                     └─────┬─────┘   │
│                     ┌─────▼─────┐   │
│                     │ RDS MySQL │   │
│                     └───────────┘   │
└─────────────────────────────────────┘
```

### Step 1 — Push to ECR
```bash
# Authenticate to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS \
  --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name flask-app

# Tag image
docker tag flask-app:latest \
  <account-id>.dkr.ecr.ap-south-1.amazonaws.com/flask-app:latest

# Push image
docker push \
  <account-id>.dkr.ecr.ap-south-1.amazonaws.com/flask-app:latest
```

### Step 2 — AWS Services Used

| Service | Purpose |
|---|---|
| ECR | Container image registry |
| ECS Fargate | Run containers (serverless) |
| RDS MySQL | Managed database |
| ALB | Load balancer & routing |
| VPC | Network isolation |
| Secrets Manager | Store DB credentials |
| CloudWatch | Logs & monitoring |

### Security Best Practices
```
✅ Flask App  → Public Subnet  (via ALB only)
✅ RDS MySQL  → Private Subnet (no internet access)
✅ DB creds   → Secrets Manager (never hardcoded)
✅ ECR images → Private registry
✅ ECS Tasks  → IAM Roles (no access keys)
✅ ALB        → HTTPS with ACM certificate
```

---

## 📈 Learning Roadmap

```
✅ Phase 1 → Run app locally (bare metal)
✅ Phase 2 → Dockerize (single stage)
✅ Phase 3 → Multistage Dockerfile + Gunicorn
✅ Phase 4 → Docker Compose (production grade)
⏭️ Phase 5 → Push to AWS ECR
⏭️ Phase 6 → Deploy on ECS Fargate + RDS
⏭️ Phase 7 → CI/CD with GitHub Actions
⏭️ Phase 8 → Kubernetes (EKS)
```

---

## 🔐 Environment Variables

| Variable | Description | Used By |
|---|---|---|
| MYSQL_ROOT_PASSWORD | MySQL root password | MySQL container |
| MYSQL_DATABASE | Database name | MySQL container |
| MYSQL_USER | Database user | MySQL container |
| MYSQL_PASSWORD | Database password | MySQL + Flask |
| MYSQL_HOST | MySQL container name | Flask app |
| MYSQL_DB | Database name | Flask app |

> ⚠️ Never commit `.env` file to GitHub!

---

## 📝 Notes

- `init_db()` must be called outside `if __name__ == '__main__'` block for Gunicorn to create tables on startup
- Always use named volumes for MySQL data persistence
- Use `condition: service_healthy` in depends_on to ensure MySQL is ready before Flask starts
- `message.sql` can be mounted to `/docker-entrypoint-initdb.d/` for automatic table creation
