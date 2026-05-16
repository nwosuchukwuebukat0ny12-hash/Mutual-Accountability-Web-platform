/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00685f",
          dark: "#004d46",
          container: "#008378",
          'on-container': "#f4fffc",
        },
        secondary: {
          DEFAULT: "#855300",
          container: "#fea619",
          'on-container': "#684000",
        },
        tertiary: {
          DEFAULT: "#4648d4",
          container: "#6063ee",
        },
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#cbdbf5",
          bright: "#f8f9ff",
          low: "#eff4ff",
          container: "#e5eeff",
          high: "#dce9ff",
          highest: "#d3e4fe",
        },
        text: {
          DEFAULT: "#0b1c30",
          muted: "#64748b",
          'on-surface-variant': "#3d4947",
        },
        outline: "#6d7a77",
        'outline-variant': "#bcc9c6",
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        'mobile-margin': '16px',
        'desktop-margin': '32px',
        'base': '8px',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 104, 95, 0.3)',
      }
    },
  },
  plugins: [],
}
