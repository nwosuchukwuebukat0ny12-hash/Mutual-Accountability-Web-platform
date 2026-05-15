/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#f8f9ff",
        surface: "#ffffff",
        'surface-dim': '#cbdbf5',
        'surface-bright': '#f8f9ff',
        'on-surface': '#0b1c30',
        primary: "#00685f",
        'on-primary': '#ffffff',
        secondary: "#855300",
        'on-secondary': '#ffffff',
        accent: "#fea619", // secondary-container mapped to accent for streaks
        success: "#0D9488", // Teal-tinted success
        warning: "#F59E0B", // Warm amber
        error: '#ba1a1a',
        text: "#0b1c30",
        'text-muted': "#3d4947",
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
