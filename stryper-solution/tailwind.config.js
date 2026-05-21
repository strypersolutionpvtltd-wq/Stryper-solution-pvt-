/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette extracted from Stryper Solution logo ──
        brand: {
          purple: {
            50:  '#faf5fb',
            100: '#f2e8f4',
            200: '#e4d0e9',
            300: '#ceadd8',
            400: '#b280c0',
            500: '#8B3A8F',  // ← exact logo purple
            600: '#7a3280',
            700: '#662a6b',
            800: '#552358',
            900: '#3d1940',
          },
          gold: {
            50:  '#fffbf0',
            100: '#fef3d0',
            200: '#fde49a',
            300: '#fcd05e',
            400: '#F5A623',  // ← exact logo gold/amber
            500: '#e8940f',
            600: '#c97a08',
            700: '#a66108',
            800: '#854d0a',
            900: '#6b3d0b',
          },
          brown: {
            500: '#7D5A2C',  // ← logo text brown
            600: '#6b4c24',
            700: '#573d1d',
          },
        },
        // Neutral system
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg':  ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.25' }],
        'display-xs':  ['1.5rem',  { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        'container': '1280px',
        'container-sm': '960px',
        'container-lg': '1440px',
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'medium':  '0 4px 25px -5px rgba(0,0,0,0.1), 0 10px 30px -5px rgba(0,0,0,0.05)',
        'strong':  '0 10px 40px -10px rgba(0,0,0,0.15), 0 20px 50px -10px rgba(0,0,0,0.1)',
        'purple':  '0 8px 30px -5px rgba(139,58,143,0.30)',
        'gold':    '0 8px 30px -5px rgba(245,166,35,0.30)',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
