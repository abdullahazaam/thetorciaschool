/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./models/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end academic color system
        torcia: {
          crimson: {
            DEFAULT: '#A01A22',
            hover: '#87131A',
            dark: '#6E0E14',
            light: '#C1252F',
            soft: '#FDF2F2',
          },
          charcoal: {
            DEFAULT: '#111827', // Gray 900
            muted: '#1F2937',   // Gray 800
            deep: '#0B0F17',
          },
          gray: {
            paragraph: '#4B5563', // Gray 600
            light: '#9CA3AF',     // Gray 400
            bg: '#F9FAFB',        // Gray 50 (Soft Off-White)
          },
          // Backward compatibility mappings
          red: {
            DEFAULT: '#A01A22',
            hover: '#87131A',
            dark: '#6E0E14',
            light: '#C1252F',
            soft: '#FDF2F2',
          },
          navy: {
            DEFAULT: '#111827',
            light: '#1F2937',
            dark: '#0B0F17',
          },
          gold: {
            DEFAULT: '#D97706',
            light: '#F59E0B',
            dark: '#B45309',
          },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
        'card': '0 10px 25px -3px rgba(17, 24, 39, 0.06), 0 4px 6px -2px rgba(17, 24, 39, 0.03)',
        'card-hover': '0 20px 35px -5px rgba(17, 24, 39, 0.1), 0 10px 10px -5px rgba(17, 24, 39, 0.04)',
        'soft-xl': '0 20px 35px -5px rgba(17, 24, 39, 0.08)',
        'crimson-glow': '0 10px 25px -5px rgba(160, 26, 34, 0.3)',
      },
      zIndex: {
        '15': '15',
      },
    },
  },
  plugins: [],
};
