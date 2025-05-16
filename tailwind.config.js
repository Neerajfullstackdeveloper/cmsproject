/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc6fd',
          400: '#39a6f7',
          500: '#1989e6',
          600: '#0c6cd0',
          700: '#0F4C81', // Primary color
          800: '#0e3a6a',
          900: '#0f325b',
        },
        teal: {
          50: '#eefefd',
          100: '#d5f7f6',
          200: '#aeecee',
          300: '#77dce2',
          400: '#3cc0cc',
          500: '#149EAE', // Accent color
          600: '#0a7f90',
          700: '#0b6775',
          800: '#0e5260',
          900: '#104550',
        },
      },
    },
  },
  plugins: [],
};