import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'theme': {
          'bg-main': 'var(--bg-main)',
          'bg-card': 'var(--bg-card)',
          'bg-header': 'var(--bg-header)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-title': 'var(--text-title)',
          'border': 'var(--border-color)',
        },
        'tag': {
          'red-bg': 'var(--tag-red-bg)',
          'red-text': 'var(--tag-red-text)',
          'blue-bg': 'var(--tag-blue-bg)',
          'blue-text': 'var(--tag-blue-text)',
          'green-bg': 'var(--tag-green-bg)',
          'green-text': 'var(--tag-green-text)',
          'yellow-bg': 'var(--tag-yellow-bg)',
          'yellow-text': 'var(--tag-yellow-text)',
        }
      },
    },
  },
  plugins: [],
};

export default config;
