/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
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
          main: '#249491',
          light: '#4db3b0',
          dark: '#1a6b69',
          contrast: '#FFFFFF',
          DEFAULT: '#249491',
          foreground: '#FFFFFF'
        },
        secondary: {
          main: '#003f59',
          light: '#005a7a',
          dark: '#002a3a',
          contrast: '#FFFFFF',
          DEFAULT: '#003f59',
          foreground: '#FFFFFF'
        },
        success: {
          main: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
          contrast: '#FFFFFF'
        },
        error: {
          main: '#F44336',
          light: '#E57373',
          dark: '#D32F2F',
          contrast: '#FFFFFF'
        },
        warning: {
          main: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
          contrast: '#FFFFFF'
        },
        info: {
          main: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
          contrast: '#FFFFFF'
        },
        background: 'hsl(var(--background))',
        text: {
          primary: '#002D32',
          secondary: '#666666'
        },
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        arabic: [
          'var(--font-cairo)'
        ]
      },
      boxShadow: {
        custom: '0 4px 6px -1px rgba(0, 45, 50, 0.1), 0 2px 4px -1px rgba(0, 45, 50, 0.06)',
        navbar: '0 1px 3px 0 rgba(0, 45, 50, 0.1), 0 1px 2px 0 rgba(0, 45, 50, 0.06)'
      },
      borderRadius: {
        custom: '0.5rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      animation: {
        wave: 'wave 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        wave: {
          '0%': {
            transform: 'rotate(0.0deg)'
          },
          '10%': {
            transform: 'rotate(14.0deg)'
          },
          '20%': {
            transform: 'rotate(-8.0deg)'
          },
          '30%': {
            transform: 'rotate(14.0deg)'
          },
          '40%': {
            transform: 'rotate(-4.0deg)'
          },
          '50%': {
            transform: 'rotate(10.0deg)'
          },
          '60%': {
            transform: 'rotate(0.0deg)'
          },
          '100%': {
            transform: 'rotate(0.0deg)'
          }
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')],
} 