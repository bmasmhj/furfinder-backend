import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        brand: {
          50: 'rgb(var(--brand-50))',
          100: 'rgb(var(--brand-100))',
          200: 'rgb(var(--brand-200))',
          300: 'rgb(var(--brand-300))',
          400: 'rgb(var(--brand-400))',
          500: 'rgb(var(--brand-500))',
          600: 'rgb(var(--brand-600))',
          700: 'rgb(var(--brand-700))',
          800: 'rgb(var(--brand-800))',
          900: 'rgb(var(--brand-900))',
        },
        neutral: {
          50: 'rgb(var(--neutral-50))',
          100: 'rgb(var(--neutral-100))',
          200: 'rgb(var(--neutral-200))',
          300: 'rgb(var(--neutral-300))',
          400: 'rgb(var(--neutral-400))',
          500: 'rgb(var(--neutral-500))',
          600: 'rgb(var(--neutral-600))',
          700: 'rgb(var(--neutral-700))',
          800: 'rgb(var(--neutral-800))',
          900: 'rgb(var(--neutral-900))',
        },
        success: 'rgb(var(--success))',
        warning: 'rgb(var(--warning))',
        error: 'rgb(var(--error))',
        info: 'rgb(var(--info))',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
