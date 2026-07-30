/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EAF0F7',
          100: '#C9D8E8',
          200: '#9CB6D2',
          300: '#6E8FB5',
          400: '#4A6D96',
          500: '#2A4E7A',
          600: '#1E3A5F',
          700: '#16294A',
          800: '#101F38',
          900: '#0B1526',
          950: '#070D1A',
        },
        amber: {
          50: '#FFF8EB',
          100: '#FEECC7',
          200: '#FDE0A0',
          300: '#FBD378',
          400: '#F5B84D',
          500: '#F2A93B',
          600: '#D98F1F',
          700: '#B5730F',
          800: '#8F5A0C',
          900: '#6B4309',
        },
        slate: {
          925: '#0E1420',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(11,21,38,0.06), 0 1px 3px 0 rgba(11,21,38,0.08)',
        'card-lg': '0 4px 6px -1px rgba(11,21,38,0.08), 0 10px 24px -6px rgba(11,21,38,0.10)',
      },
      backgroundImage: {
        'barcode': 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 2px, transparent 2px, transparent 5px, currentColor 5px, currentColor 6px, transparent 6px, transparent 10px)',
      },
    },
  },
  plugins: [],
};
