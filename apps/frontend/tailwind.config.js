/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#FBB34C',
          light: '#FFD699',
          dark: '#ee9311',
          contrast: '#FFFFFF',
        },
        secondary: {
          main: '#002D32',
          light: '#004A52',
          dark: '#001A1D',
          contrast: '#FFFFFF',
        },
        background: {
          main: '#FFFFFF',
          paper: '#F5F5F5',
        },
        text: {
          primary: '#002D32',
          secondary: '#666666',
        },
      },
      fontFamily: {
        arabic: ['var(--font-cairo)'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 45, 50, 0.1), 0 2px 4px -1px rgba(0, 45, 50, 0.06)',
        'navbar': '0 1px 3px 0 rgba(0, 45, 50, 0.1), 0 1px 2px 0 rgba(0, 45, 50, 0.06)',
      },
      borderRadius: {
        'custom': '0.5rem',
      },
      animation: {
        'wave': 'wave 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14.0deg)' },
          '20%': { transform: 'rotate(-8.0deg)' },
          '30%': { transform: 'rotate(14.0deg)' },
          '40%': { transform: 'rotate(-4.0deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

