
## 🐳 Getting Started

This project consists of multiple services including frontend, backend, and a PostgreSQL database, all managed with Docker Compose.

### Prerequisites

Make sure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started) (Docker Desktop recommended)  
- [Node.js](https://nodejs.org/en/download/) (for running helper scripts)  
- npm (comes with Node.js)  

---

### Starting the Application

To start the entire application stack (frontend, backend, database), run this command **from the root of the project**:

```bash
npm run docker
````

This runs:

```bash
docker compose up
```

---

## 🔁 Rebuilding the Application

### Standard Rebuild

If you made code changes or configuration updates and want to rebuild containers without removing Docker images, run:

```bash
npm run rebuild
```

This performs:

```bash
docker compose down
docker compose build
docker compose up
```

It stops containers, rebuilds images if necessary, and restarts the services.

---

### Full Rebuild (Clean Build)

If you want to fully reset by removing all containers and images, run:

```bash
npm run rebuild:full
```

This will:

* Stop and remove containers
* Remove Docker images related to the services
* Prune dangling images
* Rebuild images from scratch
* Restart all containers

Use this when you want to ensure a clean build environment.

---

## 🧼 Resetting the Database

If you need to wipe the local PostgreSQL database and restart fresh (e.g., for development or testing), run:

```bash
npm run reset-db
```

This script will:

1. Stop all Docker containers managed by Compose
2. Delete the local PostgreSQL data folder at `./postgres-data/` (**Warning:** this deletes all database data)
3. Restart all containers with a fresh database instance

---

## 📁 Project Structure Overview

```text
capstone-project-25t2-9900-w18c-bread/
├── backend/               # Backend API code
├── client/                # Frontend app code
├── postgres-data/         # PostgreSQL data directory (local DB volume)
├── postgres-init/         # PostgreSQL initialization scripts
├── server-postgres/       # Server or Docker configs for Postgres
├── .gitignore
├── docker-compose.yml     # Docker Compose configuration file
├── package-lock.json
├── package.json           # npm scripts and dependencies
├── README.md
├── rebuild-docker.js      # Node.js script for Docker rebuild
└── reset-db.js            # Node.js script for resetting database

```

---

## 📦 NPM Scripts Summary

| Script                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run docker`       | Start all containers (frontend, backend, DB)     |
| `npm run rebuild`      | Stop containers, rebuild images, and start again |
| `npm run rebuild:full` | Full cleanup: remove images & rebuild containers |
| `npm run reset-db`     | Remove local DB data and restart containers      |


## ❓ FAQ: Handling Line Endings in Git
### Why run `git config --global core.autocrlf false`?
To ensure consistent behavior across different operating systems and avoid issues like `/bin/bash^M: bad interpreter`, we require **all developers to use LF (Unix-style)** line endings.
Setting `core.autocrlf` to `false` disables Git's automatic line-ending conversion, ensuring that files are committed and checked out as-is. This is essential when working with Docker or Unix-based environments.
### 🔧 Command
```bash
git config --global core.autocrlf false


