import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        forensic: {
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
          purple: '#8b5cf6',
          indigo: '#6366f1',
          slate: '#0f172a'
        }
      },
    },
  },
  plugins: [],
};
export default config;
