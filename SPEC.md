# SPEC.md: Mutual - Accountability Partner Platform

## 1. Product Overview
Mutual is a web-based accountability platform designed to increase goal completion rates through social verification. Unlike standard habit trackers, progress requires partner reaction (approval, comments, nudges) to maintain momentum. 

**MVP Scope:** Focuses entirely on Invite-Only / Known-Friend accountability to ensure high engagement.
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)
**Frontend State:** Zustand
**Styling:** TailwindCSS / MUI

## 2. The Core Accountability Loop
1. **Set Goal:** User defines a specific, measurable goal with a deadline and frequency.
2. **Find Partner (Invite-First):** User invites a peer via username search. 1:1 partnership scoped to a single goal.
3. **Check-In (Verified):** User logs progress (done/partial/missed) with an optional note and optional **visual proof** (image URL).
4. **Partner Reacts (Real-Time):** Partner is notified immediately and reviews the check-in to approve it or flag it.
5. **Momentum:** Consistent approved check-ins build personal streaks. Concurrent consistency between partners unlocks "Duo Multipliers."

## 3. Data Models (Mongoose)

### User
- `name`, `username`, `email`, `passwordHash`, `bio`, `avatar`
- `categories`: Array of preferences (fitness, study, career, habit, other)
- `timezone`: String (IANA timezone, e.g., 'America/New_York', default: 'UTC')
- Gamification: `currentStreak` (personal), `longestStreak`, `totalGoals`, `completedGoals`, `badges`
- `lastActiveAt`

### Goal
- `owner`: ObjectId (User)
- `title`, `description`, `category`, `deadline`, `frequency` (daily/every2days/weekly)
- `milestones`: Array of { title, targetDate, completed }
- `progress`: Number (0-100)
- `status`: active | completed | abandoned
- Tracking: `lastCheckinAt`, `nextCheckinDue` (calculated relative to User's timezone)

### Partnership
- `goal`: ObjectId (Goal)
- `requester`, `recipient`: ObjectId (User)
- `status`: pending | active | declined | ended
- `partnerGoal`: Optional ObjectId (Goal) for mutual accountability scenarios
- `duoMultiplierActive`: Boolean (True if both partners have 'done' status for current cycle)

### CheckIn
- `goal`: ObjectId (Goal), `user`: ObjectId (User)
- `status`: done | missed | partial
- `note`: String (max 500)
- `proofUrl`: String (URL to image placeholder for accountability)
- `partnerApproval`: { approved, approvedAt, approvedBy }
- `comments`: Array of { author, text, createdAt } *(Note: Cap array size for MVP. Plan to extract to a 'Comments' collection in V2 for performance)*
- `streakAtTime`: Number

## 4. API Architecture (Express)
- **`/api/auth`**: POST `/register`, POST `/login`, GET `/me`, POST `/logout`. 
  - *Security Standard:* JWT must be set as an **HttpOnly, Secure cookie**, NOT sent in the JSON body or stored in localStorage.
- **`/api/goals`**: CRUD operations, complete goals, toggle milestones. Cascading deletes apply here.
- **`/api/checkins`**: POST new check-in, GET history, PUT approve, POST comment.
- **`/api/partnerships`**: Send, accept, decline, end requests. Search users filters by `frequency` compatibility.
- **`/api/notifications`**: Get paginated list, mark read, send manual nudge.

## 5. Frontend Architecture (React + Vite)
- **Routing:** React Router with `<PrivateRoute>` wrappers.
- **State:** Zustand (`useAuthStore`, `useGoalStore`).
- **Data Fetching:** Axios configured with `withCredentials: true` to pass the HttpOnly cookie automatically.
- **Real-Time Layer:** Implement basic polling (every 30s) OR simple `Socket.io` events strictly for the Notifications/Feed to trigger the "red dot" dopamine loop instantly when a partner reacts.
- **UI Pattern:** Page Components handle data fetching via custom hooks -> Pass data to Feature Components -> Render via UI Components.

## 6. Critical Business Logic & Edge Cases
- **Timezones:** All server calculations are UTC. "Midnight" for a user is determined by passing their IANA `timezone` to `date-fns-tz` on the backend.
- **Ghosting:** If a partner fails to react, the feed continues to show check-ins without penalizing the goal owner.
- **Mutual Misses & Multipliers:** If both partners miss a check-in, individual streaks reset. If both hit their check-ins, `duoMultiplierActive` triggers UI bonuses.
- **Abuse Prevention:** Rate limiting on partner flags (max 3 per week per goal).
- **Security:** Passwords hashed with bcrypt (12 rounds). No XSS vulnerabilities via localStorage tokens.
