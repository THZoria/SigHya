/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for Tailwind to scan for class usage
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  
  theme: {
    extend: {
      // Custom animations for enhanced user experience
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'slow-pan': 'pan 20s linear infinite',
      },
      
      // Keyframe definitions for custom animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pan: {
          '0%': { transform: 'scale(1.2) translate(0)' },
          '50%': { transform: 'scale(1.2) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1.2) translate(0)' }
        },
      },
      
      // Custom scale values for precise sizing
      scale: {
        '102': '1.02',
      },
      
      // Custom color palette for the application theme
      colors: {
        'midnight': {
          50: '#f5f7fa',
          100: '#ebeef5',
          200: '#d8dfe9',
          300: '#b9c5d8',
          400: '#94a3c3',
          500: '#7485af',
          600: '#5c6b96',
          700: '#4a577a',
          800: '#1e2538',
          900: '#111827',
        },
      },
      
      // Custom background patterns and images
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239BA3AF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  
  // Tailwind plugins (currently none)
  plugins: [],
};
