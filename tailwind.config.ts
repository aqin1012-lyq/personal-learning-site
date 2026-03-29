import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        display: ['var(--font-display-latin)', 'var(--font-display-cjk)', 'Georgia', 'serif'],
        cjk: ['var(--font-display-cjk)', 'STSong', 'Songti SC', 'Noto Serif CJK SC', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(28, 25, 23, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
