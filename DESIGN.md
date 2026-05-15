# DESIGN.md: Mutual Visual Identity & UI System

## 1. Design Philosophy
**"The Modern High-Performer."** 
The UI must feel clean, fast, and professional. We avoid "childish" rounded corners in favor of a sharp, high-tech aesthetic. The white space provides focus, while the Dark Purple accents provide the "Premium" feel.

## 2. Color Palette (Tailwind Tokens)
| Role | Color Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Base** | Pure White | `#FFFFFF` | Main backgrounds, cards |
| **Surface** | Ghost White | `#F8FAFC` | Sidebar, subtle backgrounds |
| **Primary** | Deep Orchid | `#581C87` | Headers, primary buttons, active states |
| **Accent** | Electric Blue | `#3B82F6` | Progress bars, links, "Focus" goals |
| **Success** | Emerald | `#10B981` | Approved check-ins, "Fitness" goals |
| **Warning** | Blaze Orange | `#F97316` | Streaks, nudges, "Habit" goals |
| **Text** | Obsidian | `#0F172A` | Main headings, body text |

## 3. Typography
- **Primary Font:** `Inter` or `Geist` (Sans-Serif)
- **Scale:**
  - `h1`: 2.25rem (36px), Bold, Tracking-tight
  - `h2`: 1.5rem (24px), Semi-bold
  - `Body`: 0.875rem (14px), Regular
- **Alignment:** Clean, left-aligned typography to maintain the minimalist feel.

## 4. UI Architecture (The "Modern Sharp" Look)
- **Radius:** `rounded-sm` (2px) or `rounded-md` (4px). Avoid `rounded-xl`.
- **Borders:** `1px solid #E2E8F0`. Use subtle borders instead of heavy shadows.
- **Shadows:** `shadow-sm` only. The interface should feel "flat" and architectural.
- **Buttons:** 
  - Primary: Dark Purple background, White text, Sharp corners.
  - Secondary: Ghost White background, Dark Purple text, 1px border.

## 5. Layout: The "Split Dashboard"
The main view (`/dashboard`) is split into two distinct panes:
1. **Left Pane (Self):** Your active goal, current streak, and check-in history.
2. **Right Pane (Partner):** Your partner’s live progress, approval buttons, and comment feed.
*Logic:* This creates a "Head-to-Head" competitive feel while maintaining a minimalist workspace.

## 6. Iconography
- **Library:** Lucide React
- **Style:** Thin-stroke icons (2px weight) to match the "Clean Tech" font.
- **Statuses:** 
  - Done: Emerald Green Check
  - Missed: Slate Gray X
  - Partial: Electric Blue Dot
