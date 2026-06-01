/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        background: '#0b1326',

        surface: {
          DEFAULT: '#171f33',
          lowest: '#060e20',
          low: '#131b2e',
          high: '#222a3d',
          highest: '#2d3449',
          bright: '#31394d',
        },

        primary: {
          DEFAULT: '#22d3ee',
          foreground: '#00363e',
          light: '#8aebff',
        },

        secondary: {
          DEFAULT: '#6366F1',
          foreground: '#1000a9',
        },

        success: {
          DEFAULT: '#10B981',
        },

        danger: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },

        text: {
          primary: '#dae2fd',
          secondary: '#bbc9cd',
        },

        border: {
          DEFAULT: '#3c494c',
          light: '#859397',
        },
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },

      maxWidth: {
        container: '1440px',
      },

      spacing: {
        gutter: '1.5rem',
        card: '1.25rem',
      },

      boxShadow: {
        modal: '0px 10px 30px rgba(0,0,0,0.5)',
      },
    },
  },
};