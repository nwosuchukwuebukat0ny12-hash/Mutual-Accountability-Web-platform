# Software Requirements Specification (SRS)

**For:** Mutual – Accountability Partner Platform  
**Version:** 3.0 (MVP - Top 1% Architecture Edition)  
**Date:** 2026-05-14  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)  
**Project Type:** Software Engineering Team Project

---

## 1. Introduction

### 1.1 Purpose
This document defines all functional and technical requirements for Mutual, a web-based accountability partner platform. The app solves a simple human problem: people set goals and quit because no one is watching. An accountability partner changes that. When someone else knows your goal, checks on you, and calls you out if you slip, you’re far more likely to follow through.

### 1.2 Problem Statement
Existing habit trackers provide logging and streaks but lack social consequences. Mutual uses mutual accountability partnerships to increase goal completion rates through social verification and partner reaction as the core behavioral driver.

### 1.3 Target Audience
- Individuals with specific, measurable goals (fitness, study, career, habits).
- Users who have tried single-player self-tracking apps and quit.
- Pairs of friends who want to keep each other on track.
- Strangers seeking low-pressure, opt-in mutual accountability.

### 1.4 Tech Stack Summary (The "Top 1%" Stack)

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React + Vite, React Router, Zustand (State), Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express.js, Zod (Input Validation), Socket.io (Real-time) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth & Security** | JWT + bcryptjs (Stored in HTTP-only Cookies) |
| **Background Jobs** | node-cron (For automated streak calculations) |
| **Deployment** | Render/Railway (Backend), Vercel (Frontend) |

---

## 2. General Description

### 2.1 The Core Idea (Full User Journey)
1. **You set a goal:** Not just "get fit" — something specific: "Run 3x per week for 8 weeks." You define the goal, a deadline, and check-in frequency.
2. **You get paired with a partner:** The platform matches you with someone who has a compatible goal.
3. **You check in regularly:** You log progress with a status and a text note. Your partner sees this in real time.
4. **Your partner reacts:** They approve your check-in or leave encouraging comments. This creates the social pressure that makes accountability work.
5. **The system tracks momentum:** Streaks and completion rates reflect consistency. Missing a check-in automatically breaks your streak.

### 2.2 The Accountability Loop
Set Goal $\rightarrow$ Find Partner $\rightarrow$ Check In (Text/Status) $\rightarrow$ Partner Reacts (via Socket.io) $\rightarrow$ Stay Consistent $\rightarrow$ Achieve Goal.

### 2.3 Core User Roles (Symmetric)
- **Goal Owner:** Sets the goal, submits check-ins, earns streaks.
- **Accountability Partner:** Views the owner's progress, approves check-ins, leaves comments, sends nudges.
- **Note:** In mutual partnerships, users simultaneously act as Owner and Partner.

---

## 3. Functional Requirements

### 3.1 Authentication & Security (FR-AUTH)
- **FR-AUTH-01:** Users shall register with name, username, email, password, and timezone (e.g., America/New_York).
- **FR-AUTH-02:** Passwords hashed with bcrypt (saltRounds: 12).
- **FR-AUTH-03:** Upon login, the server sets an HTTP-only, Secure Cookie containing the JWT (expires in 7 days). No tokens in localStorage.
- **FR-AUTH-04:** Protected routes use middleware to verify the JWT cookie. On 401, user is automatically logged out.
- **FR-AUTH-05:** All backend POST/PUT routes must validate incoming payload shapes using Zod before hitting the database.

### 3.2 Goal Management (FR-GOAL)
- **FR-GOAL-01:** Users shall create a goal with: title, category, description, deadline, check-in frequency, and optional milestones.
- **FR-GOAL-02:** Goal deadlines and check-in times are calculated relative to the user's saved timezone.
- **FR-GOAL-03:** Goal status can be: active, completed, or abandoned.
- **FR-GOAL-04:** Users may edit goal details until the first check-in; after that only deadline extension is allowed.
- **FR-GOAL-05:** Deleting a goal cascades: removes all check-ins, partnerships, and related notifications.

### 3.3 Partner System (FR-PARTNER)
- **FR-PARTNER-01:** A partnership is scoped to one specific goal (1:1 per goal).
- **FR-PARTNER-02:** Users shall send partnership requests by searching for a username.
- **FR-PARTNER-03:** Active partnerships grant read access to the partner's specific goal history, current streak, and check-in notes.
- **FR-PARTNER-04:** Partners shall NOT see: user's email, password, or other unrelated goals.
- **FR-PARTNER-05:** Users may end an active partnership at any time; this sets status to ended (preserves history).

### 3.4 Check-in System (V1 Text-Only) (FR-CHECKIN)
- **FR-CHECKIN-01:** Check-ins consist of: status (done, missed, partial), progress % (0-100), and a mandatory/optional note (max 500 chars). No image uploads for MVP.
- **FR-CHECKIN-02:** Only one check-in per goal per day is allowed.
- **FR-CHECKIN-03:** Partners may approve a check-in or add comments to the thread.
- **FR-CHECKIN-04:** A user cannot approve their own check-in.

### 3.5 Streak & Automated Tracking (FR-STREAK)
- **FR-STREAK-01:** Streaks are stored denormalized on the User document (currentStreak).
- **FR-STREAK-02:** A Cron Job (node-cron) runs every hour on the backend. It queries for goals where nextCheckinDue has passed based on the user's timezone.
- **FR-STREAK-03:** The Cron Job automatically inserts a 'missed' check-in and resets the currentStreak to 0 for users who failed to log data.
- **FR-STREAK-04:** Streak milestones (7, 14, 30 days) award badges stored in user.badges.

### 3.6 Real-Time Feed & Notifications (FR-FEED / FR-NOTIFY)
- **FR-FEED-01:** The shared Feed component uses Socket.io. When User A submits a check-in, the server emits an event so User B's feed updates instantly without refreshing.
- **FR-FEED-02:** Partner approvals and comments are also pushed via WebSockets in real-time.
- **FR-NOTIFY-01:** The system shall notify users of: partner requests, approvals, nudges, streak milestones, and missed check-ins.

---

## 4. Database Schema (MongoDB / Mongoose)

### 4.1 User Schema
```javascript
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  timezone: { type: String, required: true, default: 'UTC' }, // CRITICAL FOR CRON JOBS
  bio: { type: String, maxLength: 200 },
  avatar: { type: String }, 
  categories: [{ type: String, enum: ['fitness', 'study', 'career', 'habit', 'other'] }],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalGoals: { type: Number, default: 0 },
  completedGoals: { type: Number, default: 0 },
  badges: [{ type: String }],
  lastActiveAt: { type: Date },
}, { timestamps: true })
```

### 4.2 Goal Schema
```javascript
const GoalSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['fitness', 'study', 'career', 'habit', 'other'], required: true },
  deadline: { type: Date, required: true },
  frequency: { type: String, enum: ['daily', 'every2days', 'weekly'], required: true },
  milestones: [{
    title: String,
    targetDate: Date,
    completed: { type: Boolean, default: false }
  }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  isPublic: { type: Boolean, default: false },
  lastCheckinAt: { type: Date },
  nextCheckinDue: { type: Date },
}, { timestamps: true })
```

### 4.3 Partnership Schema
```javascript
const PartnershipSchema = new Schema({
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'active', 'declined', 'ended'], default: 'pending' },
  startedAt: { type: Date },
  endedAt: { type: Date },
  partnerGoal: { type: Schema.Types.ObjectId, ref: 'Goal' },
}, { timestamps: true })
```

### 4.4 CheckIn Schema
```javascript
const CheckInSchema = new Schema({
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['done', 'missed', 'partial'], required: true },
  progress: { type: Number, min: 0, max: 100 },
  note: { type: String, maxLength: 500 }, // Primary proof for V1
  partnerApproval: {
    approved: { type: Boolean, default: false },
    approvedAt: Date,
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, maxLength: 300 },
    createdAt: { type: Date, default: Date.now }
  }],
  streakAtTime: { type: Number },
}, { timestamps: true })
```

### 4.5 Notification Schema
```javascript
const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['partner_request', 'request_accepted', 'checkin_approved', 'partner_checkedin', 'checkin_reminder', 'partner_missed', 'nudge', 'streak_milestone', 'goal_deadline'],
    required: true
  },
  read: { type: Boolean, default: false },
  data: { type: Schema.Types.Mixed }, 
  link: { type: String },
}, { timestamps: true })
```

---

## 5. API Design (Express Routes)
Base URL: `/api`  
All protected routes (✅) expect a valid HTTP-only cookie.

### 5.1 Auth (/api/auth)
| Method | Route | Auth | Description |
| :--- | :--- | :--- | :--- |
| POST | `/register` | ❌ | Create account (Zod validated req.body) |
| POST | `/login` | ❌ | Login, sets HTTP-only token cookie |
| GET | `/me` | ✅ | Verify cookie, returns current user profile |
| POST | `/logout` | ✅ | Clears HTTP-only session cookie |

### 5.2 Goals, Check-ins, & Partnerships
(Standard CRUD operations matching V2, with Zod middleware applied to all POST/PUT endpoints).

---

## 6. Frontend Architecture (React)

### 6.1 Zustand Store (Cookie-Based Auth)
```javascript
const useAuthStore = create((set) => ({
  user: null,
  isAuth: false,
  isLoading: true,
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me'); // Browser sends cookie automatically
      set({ user: res.data, isAuth: true, isLoading: false });
    } catch (err) {
      set({ user: null, isAuth: false, isLoading: false });
    }
  },
  logout: async () => {
    await api.post('/auth/logout'); 
    set({ user: null, isAuth: false });
  }
}))
```

### 6.2 Axios Configuration
```javascript
import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api',
  withCredentials: true // CRITICAL: Ensures browser sends HTTP-only cookies
});

// Interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(err)
  }
)
```

### 6.3 Component Communication Pattern
- **Rule:** Pages own data fetching. Feature components receive data as props. UI components have no API calls or store access.
- **Flow:** Zustand Store $\leftrightarrow$ API Response | Page Component (reads store, calls hooks) $\rightarrow$ Feature Component $\rightarrow$ UI Component.

---

## 7. Non-Functional Requirements

| ID | Category | Requirement |
| :--- | :--- | :--- |
| **NFR-01** | Performance | Feed loads in < 2 seconds on 4G. |
| **NFR-02** | Availability | 99.5% uptime for core features. |
| **NFR-03** | Security | Passwords hashed with bcrypt; JWT stored in HTTP-only cookies; backend Zod validation. |
| **NFR-04** | Usability | New user completes setup + first check-in within 5 minutes. |
| **NFR-05** | Platform | Web + responsive mobile design. |

---

## 8. Team Split (4 People)
- **Backend Lead:** Express server setup, JWT cookie auth, Socket.io, Cron jobs, route controllers.
- **Database Dev:** Mongoose schemas, Zod validation schemas, indexes, seeding.
- **Frontend Lead:** React app structure, routing, Zustand stores, Axios integration, WebSockets client.
- **UI/UX Developer:** Component building, TailwindCSS/shadcn, responsive design, error states, and overall visual polish.

---

## 9. Edge Cases & Failure Modes

| Scenario | System Response |
| :--- | :--- |
| **Partner never reacts** | Feed still shows check-ins; no automatic penalty. |
| **Both partners miss same day** | Cron job resets both streaks independently; system notifies each. |
| **User deletes active goal** | Partnership automatically ended; partner notified. |
| **Invitation expires** | After 7 days pending, auto-cancel; sender notified. |
| **Duplicate check-in attempt** | Returns 400: "Already checked in today." |
