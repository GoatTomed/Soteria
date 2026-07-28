/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05060a',
          900: '#0a0c12',
          850: '#0f121b',
          800: '#141823',
          750: '#1a1f2e',
          700: '#232938',
          600: '#2e3548',
          500: '#3a4258',
          400: '#525a72',
          300: '#7b82a0',
          200: '#a8aec6',
          100: '#d4d8e6',
        },
        brand: {
          DEFAULT: '#4f8cff',
          50: '#eaf2ff',
          100: '#d4e6ff',
          200: '#a9cdff',
          300: '#7eb0ff',
          400: '#5f97ff',
          500: '#4f8cff',
          600: '#2f6bf0',
          700: '#1f52c4',
          800: '#1a4299',
          900: '#173a7d',
        },
        accent: {
          DEFAULT: '#22d3ee',
          400: '#38e0f2',
          500: '#22d3ee',
          600: '#0bb5cf',
        },
        success: { DEFAULT: '#34d399', 600: '#10b981' },
        warning: { DEFAULT: '#fbbf24', 600: '#f59e0b' },
        danger: { DEFAULT: '#f87171', 600: '#ef4444' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(79, 140, 255, 0.45)',
        'glow-accent': '0 0 40px -10px rgba(34, 211, 238, 0.4)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'radial-fade':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(79,140,255,0.18), transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
