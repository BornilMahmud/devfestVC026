/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tf: {
          primary: '#245CC6',
          primaryHover: '#1D4CA8',
          text: '#18263B',
          muted: '#5C6B7E',
          border: '#DEE4EC',
          canvas: '#F4F6F9',
          surface: '#FFFFFF',
          verified: '#21714C',
          verifiedBg: '#EDF7F1',
          attention: '#926009',
          attentionBg: '#FFF7E6',
          blocking: '#B23A3A',
          blockingBg: '#FEF0F0',
          focus: '#91B6FF',
          selected: '#EDF3FF',
          hoverRow: '#F8FAFC'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'Noto Sans Bengali', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
