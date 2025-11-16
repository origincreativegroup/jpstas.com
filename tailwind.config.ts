import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Earthy redesign palette
        'surface-deep': '#191d1c',
        'surface-mid': '#181c27',
        'surface-olive': '#454529',
        sand: '#d0c3a3',
        cream: '#f2efe6',
        gold: '#b98f45',
        rust: '#6c3727',

        // Semantic mappings
        primary: '#b98f45', // gold CTA
        'primary-hover': '#9d7635',
        'primary-light': '#d6b36b',
        secondary: '#454529', // deep olive
        'secondary-hover': '#373b22',
        'secondary-light': '#6a6b45',
        neutral: '#d0c3a3', // sand
        'neutral-light': '#f2efe6', // cream
        'neutral-dark': '#191d1c',
        highlight: '#6c3727', // rust accent
        'highlight-hover': '#5a2b1f',
        'highlight-light': '#8a4a36',

        // Text colors
        'text-dark': '#191d1c',
        'text-mid': '#454529',
        'text-light': '#f2efe6',

        // Legacy/compatibility (map to new palette)
        brand: '#b98f45',
        accent: '#6c3727',
        'brand-light': '#f2efe6',
        'brand-dark': '#191d1c',
        'accent-dark': '#5a2b1f',
        dark: '#191d1c',
        light: '#f2efe6',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glow': '0 0 20px rgba(85, 163, 207, 0.3)',
        'glow-lg': '0 0 40px rgba(85, 163, 207, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(85, 163, 207, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'slideUp': 'slideUp 0.6s ease-out forwards',
        'slideDown': 'slideDown 0.6s ease-out forwards',
        'slideLeft': 'slideLeft 0.6s ease-out forwards',
        'slideRight': 'slideRight 0.6s ease-out forwards',
        'scaleIn': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'zoom-in': 'zoomIn 0.4s ease-out forwards',
        'zoom-out': 'zoomOut 0.4s ease-out forwards',
        'data-flow': 'dataFlow 2s ease-in-out infinite',
        'sparkline-draw': 'sparklineDraw 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateZ(0px)' },
          '100%': { opacity: '1', transform: 'scale(1.05) translateZ(20px)' },
        },
        zoomOut: {
          '0%': { opacity: '1', transform: 'scale(1.05) translateZ(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateZ(0px)' },
        },
        dataFlow: {
          '0%, 100%': { transform: 'translateX(0px)', opacity: '1' },
          '50%': { transform: 'translateX(4px)', opacity: '0.8' },
        },
        sparklineDraw: {
          '0%': { strokeDashoffset: '100%', opacity: '0' },
          '100%': { strokeDashoffset: '0%', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
} satisfies Config;
