import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#1e40af',
        accent: '#fbbf24',
      },
    },
  },
  plugins: [],
} satisfies Config;
