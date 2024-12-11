import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    colors: {
      current: 'currentColor',
    },
    fontSize: {
      xs: ['13px', '15px'],
      s: ['14px', '16px'],
      m: ['15px', '18px'],
      l: ['17px', '24px'],
      xl: ['20px', '24px'],
      '2xl': ['23px', '28px'],
      '3xl': ['25px', '30px'],
      '4xl': ['30px', '38px'],
    },
    fontFamily: {
      primary: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        'theme-dark-primary': 'var(--theme-dark-primary)',
        'theme-dark-background': 'var(--theme-dark-background)',
        'theme-dark-foreground': 'var(--theme-dark-foreground)',
        'theme-dark-text': 'var(--theme-dark-text)',
        'theme-light-primary': 'var(--theme-light-primary)',
        'theme-light-background': 'var(--theme-light-background)',
        'theme-light-foreground': 'var(--theme-light-foreground)',
        'theme-light-text': 'var(--theme-light-text)',
        'theme-midnightBlue-primary': 'var(--theme-midnightBlue-primary)',
        'theme-midnightBlue-background': 'var(--theme-midnightBlue-background)',
        'theme-midnightBlue-foreground': 'var(--theme-midnightBlue-foreground)',
        'theme-midnightBlue-text': 'var(--theme-midnightBlue-text)',
        'theme-tokyoNight-primary': 'var(--theme-tokyoNight-primary)',
        'theme-tokyoNight-background': 'var(--theme-tokyoNight-background)',
        'theme-tokyoNight-foreground': 'var(--theme-tokyoNight-foreground)',
        'theme-tokyoNight-text': 'var(--theme-tokyoNight-text)',
        primary: 'var(--primary)',
        black: 'var(--black)',
        emerald: 'var(--emerald)',
        pink: 'var(--pink)',
        'error-1': 'var(--error-1)',
        'error-2': 'var(--error-2)',
        'button-text': 'var(--button-text)',
        tooltip: 'var(--tooltip)',
        backdrop: 'var(--backdrop)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'text-1': 'var(--text-1)',
        'text-2': 'var(--text-2)',
        'border-1': 'var(--border-1)',
      },
      opacity: {
        '07': '0.07',
        '15': '0.15',
        '16': '0.16',
        '22': '0.22',
        '60': '0.6',
        '65': '0.65',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
      },
      brightness: {
        '15': '0.15',
        '60': '0.6',
        '65': '0.65',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
      },
      scale: {
        '05': '0.05',
        '10': '0.1',
        '15': '0.15',
        '60': '0.6',
        '65': '0.65',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
      },
      keyframes: {
        swipe: {
          '0%': {
            left: '-100%',
          },
          '100%': {
            left: '100%',
          },
        },
        appear: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        logoAppear: {
          '0%': {
            opacity: '0',
            scale: '0.50',
          },
          '50%': {
            opacity: '1',
            scale: '1.25',
          },
          '100%': {
            scale: '1',
          },
        },
      },
      animation: {
        appear: 'appear .3s ease-out',
        spin: 'spin .7s linear infinite',
        swipe: 'swipe 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        logoAppear: 'logoAppear .4s',
      },
    },
  },
  plugins: [],
} satisfies Config;
