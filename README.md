# PMS Backend

This is the backend for the Project Management System (PMS), built with **TypeScript**, **Express.js**, **Sequelize**, and **WebSockets**. It provides a RESTful API to manage projects, tasks, timesheets, materials, and more.

---

## 📁 Project Structure

pms-backend/
├── dist/ # Compiled output
├── src/ # Source code
│ ├── config/ # Environment, DB, cloudinary config
│ ├── controllers/ # Controller logic
│ ├── middlewares/ # Auth and error handling
│ ├── models/ # Sequelize models
│ ├── routes/ # All API routes
│ ├── utils/ # WebSocket and other helpers
│ ├── app.ts # Express app setup
│ └── server.ts # App entry point
├── migrations/ # Sequelize migrations
├── seeders/ # Sequelize seeders
├── uploads/ # File uploads
├── Dockerfile # Docker config
├── docker-compose.yml # Docker services
├── package.json
├── tsconfig.json
└── README.md

yaml
Copy
Edit

---

## 🛠 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Sequelize** (PostgreSQL or MySQL)
- **WebSocket** (real-time features)
- **Cloudinary** (file/image uploads)
- **Docker** & **Docker Compose**

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/pms-backend.git
cd pms-backend
npm install
```
2. Configure Environment
Create a .env file in the root:
```bash
PORT=8000
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_pass
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
3. Run Locally
```bash
npm run dev
```
🐳 Run with Docker
```bash
docker-compose up --build
```
📡 API Endpoints
All APIs are prefixed with /api/v1

Examples:

POST /api/v1/auth/login

GET /api/v1/projects

POST /api/v1/tasks

...and more for: users, roles, materials, timesheets, approvals, notifications, KPIs, etc.
