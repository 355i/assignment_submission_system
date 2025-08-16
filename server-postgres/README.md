# 🏫 Virtual Teaching Assistant – Server (PostgreSQL Backend)

This is the **backend server** for the **Virtual Teaching Assistant** platform using **PostgreSQL** as the database. This server handles API requests, manages quiz data, and serves various student-teacher interactions using Express.js, and PostgreSQL for data storage.

---

## 🚀 Features

- 📝 **RESTful API Endpoints** – Manage quiz, summary, student, and teacher data
- 🗄️ **PostgreSQL Database** – Efficient data storage with query handling
- 📂 **Modular Routes** – Dedicated routes for different functionalities
- 🛠️ **Environment Configuration** – Secure database credentials using `.env` file
- 🌐 **CORS Support** – Handle cross-origin requests for frontend interaction

---

## 🛠️ Tech Stack

| Category            | Tech/Library                        |
|---------------------|--------------------------------------|
| 💻 Server Framework | `Express.js` (Node.js)               |
| 🗃️ Database         | `PostgreSQL`                         |
| 🔧 Query Builder     | `pg` (PostgreSQL Node.js Client)     |
| 🛡️ Environment       | `dotenv`                             |
| 🌐 CORS Handling     | `cors`                               |
| 📂 File Handling     | `multer`, `pdf-parse`                |

---

## 🔧 Setup Instructions

### ✅ Prerequisites

* Node.js (v16+ recommended)
* PostgreSQL database up and running
* `.env` file with database credentials

### 🧪 Installation

```bash
# Clone the repository
cd server-postgres

# Install dependencies
npm install
```

### 📄 .env Example

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=1000
```

---

## ▶️ Running the Server

Start the server with `nodemon` for development:

```bash
npm start
```

This will start the server on port `1000` by default (or another port defined in your `.env`).

The server will also attempt to connect to the PostgreSQL database and will log the connection status.

---

## 🌐 API Endpoints

| Method     | Endpoint   | Description                               |
| ---------- | ---------- | ----------------------------------------- |
| 📤 POST    | `/quiz`    | Generate and manage quizzes               |
| 📝 POST    | `/summary` | Generate summary based on lecture content |
| 🧑‍🎓 POST | `/student` | Manage student data and interactions      |
| 👩‍🏫 POST | `/teacher` | Manage teacher data and interactions      |

---

## 🧪 Testing & Debugging

* Use tools like [Postman](https://www.postman.com/) for testing API endpoints.
* Logs will display database connection success or errors, along with API usage.

---

## 🛡️ Production Deployment

For deployment in production, you can use services like **Heroku**, **AWS EC2**, or **DigitalOcean**. Ensure that your `.env` file contains correct production credentials for the database.

For Docker deployments, create a `Dockerfile` and configure environment variables for the database connection.

---

## 🤝 Contributing

We welcome all contributors! You can:

* 🔍 Report bugs
* 🌱 Suggest new features
* 📦 Submit pull requests

---

### 👨‍🏫 Let's build better classrooms with AI and PostgreSQL! 🚀

---
