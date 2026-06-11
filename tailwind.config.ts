import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // === RAVEN STORE COLOR SYSTEM ===
      colors: {
        background: "#0A0A0A",
        surface: "#1A1A1A",
        border: "#E8E8E0",
        "text-primary": "#F5F5F0",
        "text-secondary": "#AAAAAA",
        accent: "#FFFFFF",
        // Semantic
        ink: {
          50: "#F5F5F0",
          100: "#E8E8E0",
          200: "#CCCCCC",
          300: "#AAAAAA",
          400: "#888888",
          500: "#666666",
          600: "#444444",
          700: "#2A2A2A",
          800: "#1A1A1A",
          900: "#0A0A0A",
        },
      },

      // === TYPOGRAPHY ===
      fontFamily: {
        display: ["Bangers", "Impact", "fantasy"],
        body: ["Comic Neue", "Comic Sans MS", "cursive"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1", letterSpacing: "0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1", letterSpacing: "0.03em" }],
        "display-lg": ["3rem", { lineHeight: "1.05", letterSpacing: "0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.1", letterSpacing: "0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.15", letterSpacing: "0.01em" }],
      },

      // === COMIC BORDER & SHADOW ===
      borderWidth: {
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "6": "6px",
      },
      boxShadow: {
        "comic-sm": "3px 3px 0px #E8E8E0",
        "comic": "5px 5px 0px #E8E8E0",
        "comic-md": "6px 6px 0px #E8E8E0",
        "comic-lg": "8px 8px 0px #E8E8E0",
        "comic-xl": "12px 12px 0px #E8E8E0",
        "comic-inset": "inset 3px 3px 0px #E8E8E0",
        "comic-hover": "8px 8px 0px #FFFFFF",
      },

      // === SPACING ===
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // === ANIMATIONS ===
      keyframes: {
        "ink-splatter": {
          "0%": { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          "50%": { transform: "scale(1.15) rotate(5deg)", opacity: "0.9" },
          "75%": { transform: "scale(0.95) rotate(-2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "ink-drip": {
          "0%": { clipPath: "inset(0 0 100% 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0 0% 0)", opacity: "1" },
        },
        "panel-slide-in": {
          "0%": { transform: "translateX(-100%) skewX(-5deg)", opacity: "0" },
          "100%": { transform: "translateX(0) skewX(0)", opacity: "1" },
        },
        "panel-slide-up": {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "comic-shake": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "halftone-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "stagger-fade": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "border-flash": {
          "0%, 100%": { borderColor: "#E8E8E0" },
          "50%": { borderColor: "#FFFFFF" },
        },
        "loader-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "ink-splatter": "ink-splatter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "ink-drip": "ink-drip 0.5s ease-out forwards",
        "panel-slide-in": "panel-slide-in 0.5s ease-out forwards",
        "panel-slide-up": "panel-slide-up 0.4s ease-out forwards",
        "comic-shake": "comic-shake 0.15s ease-in-out 2",
        "halftone-pulse": "halftone-pulse 3s ease-in-out infinite",
        "stagger-fade": "stagger-fade 0.5s ease-out forwards",
        "border-flash": "border-flash 0.3s ease-in-out",
        "loader-spin": "loader-spin 1s linear infinite",
      },

      // === BORDER RADIUS ===
      borderRadius: {
        "comic": "2px",
        "comic-sm": "1px",
        "comic-lg": "4px",
      },

      // === BACKGROUND ===
      backgroundImage: {
        "halftone": "radial-gradient(circle, #E8E8E0 1px, transparent 1px)",
        "halftone-dark": "radial-gradient(circle, #2A2A2A 1px, transparent 1px)",
        "comic-lines": "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(232, 232, 224, 0.05) 3px, rgba(232, 232, 224, 0.05) 4px)",
        "speed-lines": "repeating-conic-gradient(from 0deg, transparent 0deg 8deg, rgba(232, 232, 224, 0.02) 8deg 10deg)",
      },
      backgroundSize: {
        "halftone": "16px 16px",
        "halftone-sm": "8px 8px",
        "halftone-lg": "24px 24px",
      },

      // === TRANSITIONS ===
      transitionTimingFunction: {
        "comic": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "snap": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
      },
    },
  },
  plugins: [],
};

export default config;
