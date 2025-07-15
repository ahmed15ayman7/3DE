import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1a365d',
          light: '#2c5282',
          dark: '#0f2027',
          50: '#e6f1ff',
          100: '#b8d4ff',
          200: '#8ab6ff',
          300: '#5c99ff',
          400: '#2e7bff',
          500: '#005eff',
          600: '#0047cc',
          700: '#003199',
          800: '#001a66',
          900: '#000433'
        },
        secondary: {
          main: '#2d3748',
          light: '#4a5568',
          dark: '#1a202c',
          50: '#f7fafc',
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923'
        },
        success: {
          main: '#38a169',
          light: '#68d391',
          dark: '#2f855a'
        },
        error: {
          main: '#e53e3e',
          light: '#fc8181',
          dark: '#c53030'
        },
        warning: {
          main: '#d69e2e',
          light: '#f6e05e',
          dark: '#b7791f'
        },
        info: {
          main: '#3182ce',
          light: '#63b3ed',
          dark: '#2c5282'
        }
      },
      fontFamily: {
        sans: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'Cairo', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

export default config 