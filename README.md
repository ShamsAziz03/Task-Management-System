# 📋 Tasks Management System

> **Final Project** — Advanced Web Programming Course | Spring 2025 | Computer Engineering Department - NNU

A full-stack **Single Page Application (SPA)** designed to help students and administrators organize, track, and manage tasks and projects — with real-time chat, role-based access, and a modern dark UI.

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![LESS](https://img.shields.io/badge/LESS-1D365D?style=for-the-badge&logo=less&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- 🔐 **User Authentication** — Sign up / Sign in with "Stay signed in" option
- 👥 **Role-Based Access** — Separate dashboards and permissions for Students and Administrators
- ✅ **Task Management** — Create, view, edit, delete tasks with status tracking (Pending, In Progress, Done)
- 📁 **Project Management** — Admins can create and assign projects with deadlines and descriptions
- 💬 **Real-Time Chat** — WebSocket-powered messaging between admins and students, with Caesar cipher encryption
- 🎓 **Student Profiles** — University ID input for identification and task assignment
- 🕐 **Date & Time Display** — Live date/time to keep users aware of deadlines
---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/ShamsAziz03/Task-Management-System.git
cd Task-Management-System
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Run the server:

```bash
node app.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Database Models

### User
| Field | Type 
|-------|------
| name | String 
| password | String 
| role | String 
| studentId | String 

### Task
| Field | Type
|-------|------
| name | String 
| description | String 
| projectName | String 
| assignedStudent | String 
| status | String 
| dueDate | String 

### Project
| Field | Type 
|-------|------
| title | String 
| description | String 
| deadline | String 
| status | String 
| assignedTo | String 

---

## 🔗 Links

- 🎥 **Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/19kKPhqNjZ8eb06Syg3CKaHnf9Gey3ibw/view?usp=drivesdk)
- 💻 **GitHub Repo**: [Task-Management-System](https://github.com/ShamsAziz03/Task-Management-System.git)

---

## 📦 Development Phases

| Phase | Description
|-------|-------------
| Phase 1 | HTML + CSS (LESS) + JS with localStorage
| Phase 2 | Refactor to React + Tailwind CSS 
| Phase 3 | Node.js Backend + GraphQL + MongoDB

---
