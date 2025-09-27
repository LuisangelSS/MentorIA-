import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    "./src/**/*.{html,js}",
    "./frontend/**/*.{html,js}",
    "./*.html",
    "./scripts/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de MentorIA
        primary: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cde0',
          300: '#A3B5CD', // Color principal de texto
          400: '#7a9cc6',
          500: '#5182b5',
          600: '#4a73a4',
          700: '#3d5f87',
          800: '#2f4a6a',
          900: '#1e3248'
        },
        secondary: {
          50: '#f8f9fc',
          100: '#e8ecf7',
          200: '#d1d9ef',
          300: '#b0bfe3',
          400: '#8ba0d5',
          500: '#6f84c7',
          600: '#5a6fb8',
          700: '#4f62a8',
          800: '#464973', // Color de contenedores secundarios
          900: '#3a4061'
        },
        dark: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0bcc9',
          400: '#859aac',
          500: '#677c91',
          600: '#526578',
          700: '#445462',
          800: '#3a4752',
          900: '#161B32', // Color de elementos oscuros
          950: '#0C0C1C'  // Color de fondo principal
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
})
