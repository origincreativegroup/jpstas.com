import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary Color Palette (from design image)
        'navy': '#2E3192', // Deep Navy/Purple - Primary brand color
        'lavender': '#E8E8F0', // Soft Lavender - Neutral/backgrounds
        'golden': '#D4A14A', // Golden Yellow - Accent/highlight
        'olive': '#6B5D3F', // Olive Brown - Secondary/earthy tone
        'charcoal': '#2E3192', // Navy - matches primary

        // Semantic color mappings
        primary: '#2E3192', // Navy
        'primary-hover': '#252980', // Darker navy for hover
        'primary-light': '#4A4DB8', // Lighter navy for backgrounds
        secondary: '#6B5D3F', // Olive
        'secondary-hover': '#5A4D34', // Darker olive
        'secondary-light': '#8B7D5F', // Lighter olive
        tertiary: '#2E3192', // Navy (same as primary)
        neutral: '#E8E8F0', // Lavender
        highlight: '#D4A14A', // Golden
        'highlight-hover': '#C08F39', // Darker golden
        'highlight-light': '#E0B765', // Lighter golden

        // Text colors (ADA compliant)
        'text-primary': '#2E3192', // Navy - primary text color
        'text-secondary': '#6B5D3F', // Olive - secondary text
        'text-tertiary': '#5a5a5a', // Medium-dark gray - 7:1 contrast

        // Legacy/compatibility (map to new palette)
        'royal-blue': '#2E3192',
        'teal-aqua': '#6B5D3F',
        'navy-blue': '#2E3192',
        'amber': '#D4A14A',
        'pure-white': '#FFFFFF',
        brand: '#2E3192',
        accent: '#D4A14A',
        'brand-light': '#E8E8F0',
        'brand-dark': '#2C2C2C',
        'accent-dark': '#C08F39',
        dark: '#1a1a1a',
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
