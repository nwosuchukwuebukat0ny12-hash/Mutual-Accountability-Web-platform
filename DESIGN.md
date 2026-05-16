---
name: Accountability System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is built to foster a sense of momentum, reliability, and collective growth. It positions itself at the intersection of a high-performance productivity tool and a warm, supportive community space. The aesthetic is **Corporate Modern** with a focus on high-clarity information architecture, ensuring that users feel organized and in control of their goals.

The visual language emphasizes "Progress as a Path." By utilizing a clean, card-based interface, this design system reduces cognitive load, allowing users to focus entirely on their milestones. The tone is encouraging but disciplined, using vibrant color accents to celebrate "wins" while maintaining a professional gray-scale foundation for deep work and planning.

## Colors

The color palette is engineered to drive action and reward consistency. 

*   **Primary (Vibrant Teal):** Used for primary actions, growth indicators, and active states. It represents the "Go" signal and professional development.
*   **Secondary (Warm Amber):** Reserved for motivational elements, such as current streaks, badges, and "on-fire" status. It provides a warm contrast to the cooler primary tones.
*   **Neutral Palette:** A sophisticated range of cool grays and off-whites provides the canvas. We use high-contrast slate for text to ensure maximum readability.
*   **Semantic Colors:** Success (Green), Warning (Orange), and Error (Red) follow standard conventions but are adjusted to match the saturation levels of the primary teal for visual harmony.

## Typography

This design system utilizes a dual-font strategy to balance energy with utility.

*   **Montserrat (Headings):** Chosen for its geometric confidence. Bold weights are used for achievements, titles, and numerical milestones to create a sense of importance and celebration.
*   **Inter (Body & UI):** Chosen for its exceptional legibility at all sizes. It handles data-heavy views—such as goal descriptions and community feeds—with a neutral, professional tone.

All type scales follow a strict 4px baseline grid to maintain vertical rhythm. Tracking is slightly tightened on large display headings for a modern, "tucked" look.

## Layout & Spacing

The layout philosophy is based on a **12-column fluid grid** for desktop and a **4-column grid** for mobile devices. 

*   **Grid System:** On desktop, content is typically housed in a 1280px max-width container. Cards often span 4 columns (3-up) or 6 columns (2-up) to maintain a balanced information density.
*   **Spacing Rhythm:** A strict 8px base unit (1rem = 16px) governs all margins and padding. 
*   **Responsiveness:** Mobile views transition to a single-column stacked layout. Padding is reduced to 16px at the edges to maximize screen real estate for goal-tracking dashboards.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layering**. 

1.  **Level 0 (Base):** The `background_secondary` (#F8FAFC) acts as the canvas.
2.  **Level 1 (Cards):** Primary content containers use a white background with a 1px subtle border (#E2E8F0) and a soft, diffused shadow (0px 4px 12px rgba(13, 148, 136, 0.05)). The slight teal tint in the shadow adds brand coherence.
3.  **Level 2 (Interaction):** Hover states on cards or active dropdowns increase shadow spread and opacity to suggest lift.
4.  **Level 3 (Modals):** High-elevation elements use a backdrop blur (12px) on the overlay to keep the focus entirely on the task at hand (e.g., adding a new goal).

## Shapes

The shape language is consistently **Rounded (Level 2)**. 

*   **Standard Elements:** Buttons, input fields, and cards utilize a 0.5rem (8px) corner radius to feel approachable yet modern.
*   **Large Components:** Featured dashboard cards and progress containers use a 1rem (16px) radius to soften the large surface areas.
*   **Interactive Accents:** Progress bars and "Active" status pills use a fully rounded (pill-shaped) style to signify fluid movement and continuity.

## Components

### Buttons & Controls
*   **Primary Action:** Solid Teal background with white Montserrat text. High-contrast and bold.
*   **Secondary Action:** Ghost style with Teal border and text for less urgent navigation.
*   **Motivational CTA:** Warm Amber background, used sparingly for "Start Streak" or "Claim Reward" buttons.

### Progress Indicators
*   **Linear Bars:** Use a thick 8px height with rounded ends. Background is a soft gray, with the fill using the Primary Teal.
*   **Radial Charts:** Used for daily goal completion. Features a centered Montserrat "Percentage" label.

### Cards
*   **Goal Cards:** Contain a category icon (top-left), a bold Montserrat title, a progress bar, and a "Partners" footer showing small user avatars.
*   **Community Cards:** Minimalist layout focusing on "Proof of Work" photos or text updates, framed by soft borders.

### Inputs & Categories
*   **Fields:** Clean borders that turn Teal on focus. Labels are Inter-Bold for clarity.
*   **Category Icons:** Enclosed in soft-colored circles (e.g., light blue for Career, light green for Fitness) to provide immediate visual categorization.
