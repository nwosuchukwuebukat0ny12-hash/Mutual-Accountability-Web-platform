# 🤝 Mutual: The Accountability Partner Platform

> *People set goals and quit because no one is watching. Mutual changes that.*

Mutual is a full-stack MERN application that pairs users together to achieve their goals. It moves beyond single-player habit tracking by introducing mutual accountability, photo/text check-ins, and real-time social reactions to keep streaks alive.

Built as a high-performance MVP in a 14-day sprint.

## ✨ Features
* **Goal Engine:** Set specific goals, deadlines, and check-in frequencies.
* **Auto-Matching:** Search for partners or get matched based on goal compatibility.
* **The Accountability Feed:** A real-time, shared feed of daily check-ins.
* **Live Reactions:** Partners can approve check-ins or leave comments instantly via WebSockets.
* **Automated Streaks:** Background cron jobs track consistency and penalize missed days based on local timezones.

## 🛠️ Tech Stack
**Frontend:**
* React 18 (Vite)
* React Router v6
* Zustand (State Management)
* Tailwind CSS + shadcn/ui (Styling)
* Axios (Data Fetching)

**Backend:**
* Node.js + Express.js
* MongoDB + Mongoose ODM
* Socket.io (Real-time updates)
* Zod (Schema Validation)
* node-cron (Background jobs)
* JWT + bcryptjs (HTTP-only Cookie Auth)

---

## 🚀 Local Development Setup

Follow these steps to run the Mutual platform on your local machine.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local installation or a free MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mutual.git
cd mutual
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database & Auth
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=generate_a_random_secret_key_here
```

### 4. Run the Application
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory in a new terminal)
npm run dev
```

## 📂 Project Structure
```text
mutual/
├── client/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI (shadcn/ui)
│   │   ├── pages/         # Route views (Dashboard, Login, etc.)
│   │   ├── store/         # Zustand state management
│   │   └── lib/           # Axios config and utils
├── server/                # Node.js Backend
│   ├── controllers/       # Route logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express API routes
│   ├── middleware/        # Auth & Zod validation
│   └── jobs/              # node-cron streak calculators
└── README.md
```

## 👥 The Team
Built by a 4-person software engineering squad:
* **Backend Lead:** Server, Auth, WebSockets, Cron Jobs
* **Database Developer:** Schemas, Zod Validation, Seeding
* **Frontend Lead:** React Architecture, Zustand, API Wiring
* **UI/UX Developer:** Tailwind CSS, shadcn/ui, Responsive Design
