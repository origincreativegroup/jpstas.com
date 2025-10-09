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
        'text-primary': '#1E3C0F',
        'text-secondary': '#6B635B',
        
        // Additional semantic colors
        primary: '#55A3CF', // Royal blue
        secondary: '#00BF5F', // Teal aqua
        tertiary: '#1E3C0F', // Navy blue
        neutral: '#E8E8F0', // Lavender
        dark: '#2C2C2C', // Charcoal
        highlight: '#FFA500', // Amber
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
