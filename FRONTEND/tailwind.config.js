/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#0b1326",

        surface: {
          lowest: "#060e20",
          low: "#131b2e",
          DEFAULT: "#171f33",
          high: "#222a3d",
          highest: "#2d3449",
          bright: "#31394d",
        },

        primary: {
          DEFAULT: "#22d3ee",
          light: "#8aebff",
          foreground: "#00363e",
        },

        secondary: {
          DEFAULT: "#6366F1",
        },

        success: "#10B981",

        text: {
          primary: "#dae2fd",
          secondary: "#bbc9cd",
        },

        border: {
          DEFAULT: "#3c494c",
          light: "#859397",
        },
      },

      boxShadow: {
        glow: "0 0 25px rgba(34,211,238,0.15)",
        card: "0px 10px 30px rgba(0,0,0,0.5)",
      },

      borderRadius: {
        md: "8px",
        lg: "16px",
        xl: "24px",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },

  plugins: [],
}