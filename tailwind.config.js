/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#f8fafc',
        muted: '#94a3b8',
        'muted-foreground': '#94a3b8',
        primary: '#111827',
        'primary-foreground': '#ffffff',
        secondary: '#1f2937',
        'secondary-foreground': '#e5e7eb',
        destructive: '#ef4444',
        'destructive-foreground': '#fff1f2',
        ring: '#93c5fd',
        gold: '#C19A6B',
        cream: '#F5EAD7',
        ink: '#0b1220',
        card: '#0b1220',
        border: '#1f2937',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};

