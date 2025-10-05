import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: '#282850', // Dark blue from resume
        accent: '#D4A848', // Golden yellow from resume
        'brand-light': '#E8E8F0', // Light blue/lavender
        'brand-dark': '#1A1A3A', // Darker blue
        'accent-dark': '#B8943A', // Darker golden yellow
        'neutral-warm': '#6B635B', // Dark brown/olive
        'text-primary': '#282850',
        'text-secondary': '#6B635B',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [import('@tailwindcss/typography')],
} satisfies Config;
