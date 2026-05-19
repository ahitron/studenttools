import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        surface: '#F7F6F3',
        panel: '#FFFFFF',
        primary: '#1E1E2E',
        muted: '#6B7280',
        accent: '#4F46E5',
        'accent-fg': '#FFFFFF',
        'border-default': '#E5E3DC',
        'bg-input': '#FFFFFF',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
} satisfies Config
