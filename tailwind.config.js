/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cedar: {
          50: '#f7faf4',
          100: '#e9f2e0',
          300: '#aac894',
          500: '#567a49',
          700: '#2f5438',
          900: '#183326'
        },
        lebanon: {
          red: '#c5282f',
          redDark: '#8f1e24',
          stone: '#f2eee7',
          ink: '#17201b'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ]
      },
      boxShadow: {
        soft: '0 22px 80px rgba(24, 51, 38, 0.12)'
      }
    }
  },
  plugins: []
};
