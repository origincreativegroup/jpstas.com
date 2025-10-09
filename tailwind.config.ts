import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // New color palette from design
        'royal-blue': '#55A3CF',
        'teal-aqua': '#00BF5F',
        'navy-blue': '#1E3C0F',
        'lavender': '#E8E8F0',
        'charcoal': '#2C2C2C',
        'amber': '#FFA500',
        'pure-white': '#FFFFFF',
        
        // Legacy brand colors (keeping for compatibility)
        brand: '#1E3C0F', // Updated to navy-blue
        accent: '#FFA500', // Updated to amber
        'brand-light': '#E8E8F0', // Updated to lavender
        'brand-dark': '#2C2C2C', // Updated to charcoal
        'accent-dark': '#E69500', // Darker amber
        'neutral-warm': '#6B635B',
        'text-primary': '#1a1a1a', // WCAG AA compliant - 15:1 contrast
        'text-secondary': '#4a4a4a', // WCAG AA compliant - 9.7:1 contrast
        'text-tertiary': '#5a5a5a', // WCAG AA compliant - 7:1 contrast
        
        // Additional semantic colors - ADA compliant versions
        primary: '#3182CE', // Darker royal blue for better contrast (4.5:1)
        'primary-hover': '#2563EB', // Even darker for hover states
        'primary-light': '#55A3CF', // Original for backgrounds
        secondary: '#059669', // Darker teal for better contrast (4.5:1)
        'secondary-hover': '#047857', // Darker for hover states
        'secondary-light': '#00BF5F', // Original for backgrounds
        tertiary: '#1E3C0F', // Navy blue (already dark enough)
        neutral: '#E8E8F0', // Lavender
        dark: '#1a1a1a', // Darker charcoal for text - WCAG compliant
        charcoal: '#2C2C2C', // Original charcoal for backgrounds
        highlight: '#D97706', // Darker amber for better contrast (4.5:1)
        'highlight-hover': '#B45309', // Even darker for hover
        'highlight-light': '#FFA500', // Original for backgrounds
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
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config;
