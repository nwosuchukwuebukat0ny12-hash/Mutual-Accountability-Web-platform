/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FFFFFF",
        surface: "#F8FAFC",
        primary: "#581C87",
        accent: "#3B82F6",
        success: "#10B981",
        warning: "#F97316",
        text: "#0F172A",
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
