/** @type {import('tailwindcss').Config} */
const { default: colors } = require('tailwindcss/colors');
const baseConfig = require('../../tailwind.config.js');
module.exports = {
  ...baseConfig,
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './index.ts',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: {
          main: '#249491',
          light: '#4db3b0',
          dark: '#1a6b69',
          DEFAULT: '#249491',
        },
        secondary: {
          main: '#003f59',
          light: '#005a7a',
          dark: '#002a3a',
          DEFAULT: '#003f59',
        },
      },
    },
  },
  plugins: [],
} 