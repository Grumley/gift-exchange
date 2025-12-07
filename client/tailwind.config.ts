import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#e5e0d8",
        background: "#faf8f5",
        foreground: "#1f1f1f",
        primary: {
          DEFAULT: "#1a472a",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f5f3f0",
          foreground: "#1f1f1f",
        },
        destructive: {
          DEFAULT: "#8b1538",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#d4a84b",
          foreground: "#1f1f1f",
        },
        muted: {
          DEFAULT: "#f5f3f0",
          foreground: "#6b6b6b",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f1f1f",
        },
        input: "#e5e0d8",
        ring: "#1a472a",
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1f1f1f",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
