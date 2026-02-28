# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# 🗳️ Smart E-Voting System

A full-stack MERN (MongoDB, Express, React, Node.js) based Smart Electronic Voting System with Admin & Student dashboards, live election management, result analytics, and tie handling.

---

## 🚀 Features

### 👨‍💼 Admin Panel
- Create Election
- Start / End Election
- Add / Delete Candidates
- View Results (with vote percentage)
- Tie Detection Logic
- Pie Chart Visualization
- Winner Confetti Effect 🎉
- Admin Analytics Dashboard 📊
- Election History Page 🕒

### 🎓 Student Panel
- Secure Login
- View Active Election
- Vote for Candidate
- One Student = One Vote
- Prevent Double Voting
- Real-time Vote Count Update

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- Chart.js
- React Confetti

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 📁 Project Structure

```
smart-voting/
│
├── client/              # React Frontend
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── server/              # Node Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
│
└── README.md
```

---

## 🔐 Authentication Flow

- User logs in
- JWT token stored in localStorage
- Axios interceptor attaches token automatically
- Protected routes for Admin access

---

## 🗳 Voting Logic

- Each student can vote only once per election
- Unique index on `{ student, election }`
- Vote count stored inside Candidate model
- Duplicate voting prevented at database level

---

## 🏆 Result Logic

- Election must be ended before viewing results
- Total votes calculated dynamically
- Vote percentage calculated as:

  ```
  (candidateVotes / totalVotes) * 100
  ```

- If multiple candidates have same highest votes:
  - `isTie = true`
  - Display tie message
- Otherwise:
  - Display winner
  - Show confetti effect 🎉

---

## 📊 Admin Analytics Dashboard

Displays:
- Total Elections
- Total Candidates
- Total Votes
- Visual charts

---

## 🕒 Election History

- Shows all ended elections
- View previous election results
- Navigate back to Admin Dashboard

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/smart-voting.git
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
npm run dev
```

Create `.env` file inside `server` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

Backend runs on:
```
http://localhost:5000
```

---

## 📡 API Endpoints

### 🗳 Elections

| Method | Route |
|--------|--------|
| POST | /api/elections |
| PUT | /api/elections/start/:id |
| PUT | /api/elections/end/:id |
| GET | /api/elections/results/:id |
| GET | /api/elections/analytics |
| GET | /api/elections/history |
| GET | /api/elections/active |
| GET | /api/elections/latest |

---

### 👤 Candidates

| Method | Route |
|--------|--------|
| POST | /api/candidates |
| GET | /api/candidates |
| GET | /api/candidates?electionId=xxx |
| DELETE | /api/candidates/:id |

---

### 🗳 Votes

| Method | Route |
|--------|--------|
| POST | /api/votes |

---

## 🧪 Edge Cases Handled

- No active election
- Election not ended before result
- Duplicate vote prevention
- Tie situation
- Zero vote case
- No candidates found
- Secure admin-only routes

---

## 🎯 Future Improvements

- Email verification
- OTP-based voting
- Real-time updates using Socket.io
- Export results as PDF
- Role-based dashboards
- Blockchain integration (Advanced)

---

## 👨‍💻 Developed By

**Pratyush Rawat**

---

## 📜 License

This project is developed for educational purposes.

---

# ⭐ Project Status

✅ Fully Functional  
✅ Secure Voting System  
✅ Admin Analytics  
✅ Election History  
✅ Vote Percentage  
✅ Tie Handling  
✅ Charts & Confetti Effect  
