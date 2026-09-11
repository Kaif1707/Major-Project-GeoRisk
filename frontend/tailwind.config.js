/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#e0edff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        surface: {
          base: '#0B0F17',       // Deep slate dark background
          elevated: '#111827',   // Card background
          hover: '#1F2937',      // Interactive hover
          border: '#1E293B',     // Subtle borders
        },
        risk: {
          veryLow: '#10B981',   // Green
          low: '#34D399',       // Light Green
          moderate: '#FBBF24',  // Amber
          elevated: '#F97316',  // Orange
          high: '#EF4444',      // Red
          extreme: '#991B1B',   // Deep Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
