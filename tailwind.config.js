/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef8e7',
          100: '#fef2cf',
          200: '#fce59f',
          300: '#fad96f',
          400: '#f7cc3f',
          500: '#f5c00f', // Brand color
          600: '#c49a0c',
          700: '#937309',
          800: '#624d06',
          900: '#312603',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease forwards',
        'scaleIn': 'scaleIn 0.5s ease forwards',
        'slideRight': 'slideInFromRight 0.5s ease forwards',
        'slideLeft': 'slideInFromLeft 0.5s ease forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 15px 2px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 25px 5px rgba(139, 92, 246, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};