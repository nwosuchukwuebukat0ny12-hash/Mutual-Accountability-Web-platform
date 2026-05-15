---
name: Mutual AI Directive
role: Principal MERN Engineer
version: 1.0.0
---

# CLAUDE.md: Operational Rules for "Mutual"

## 1. Project Context
You are building **Mutual**, a MERN-stack accountability platform. 
- **Tech Stack:** MongoDB, Express, React (Vite), Node.js.
- **State Management:** Zustand.
- **Styling:** Tailwind CSS + shadcn/ui.
- **Security:** JWT via HttpOnly Secure Cookies (No localStorage).

## 2. Technical Standards (The "Top 1%" Rules)
- **React:** Use functional components with arrow function syntax. 
- **Async:** Use `async/await` with `try/catch` blocks exclusively. No `.then()` chains.
- **Validation:** Use **Zod** for all backend request body validation (fail early, fail loud).
- **Timezones:** Use `date-fns-tz` for all streak/deadline logic. Always reference the `user.timezone` from the DB.
- **Auth:** Never return `passwordHash` in API responses. Use the `checkAuth` middleware for all `/api/goals`, `/api/partnerships`, and `/api/checkins` routes.

## 3. Component Architecture
Follow a **Feature-Based** structure:
- `client/src/features/[feature-name]/components`
- `client/src/features/[feature-name]/hooks`
- `client/src/features/[feature-name]/services`
This minimizes merge conflicts for the 4-person team.

## 4. Operational Workflow
1. **Architect Mode:** Before writing code, you must:
   - Analyze `SRS.md` and `DESIGN.md`.
   - Output a brief "Execution Plan" (Files to create/modify).
   - Wait for user approval.
2. **Safety First:** Always ask for permission before running `npm install` or destructive Git commands.
3. **Definition of Done:** 
   - Code must pass linting.
   - For streak-related logic, a basic test case must be provided.
   - Conventional Commits must be used (e.g., `feat(goals): ...`, `fix(auth): ...`).

## 5. Visual Consistency
- Reference `DESIGN.md` for all Tailwind classes.
- Use `rounded-sm` or `rounded-md` (sharp corners) as per the "Modern Sharp" aesthetic. Avoid `rounded-xl`.
- Use the `Success` (#10B981) color for check-ins and `Warning` (#F97316) for streaks.

## 6. The Two-Strike Rule
If a fix fails twice with the same error, STOP. Do not loop. Explain the bottleneck to the user and request manual intervention.
