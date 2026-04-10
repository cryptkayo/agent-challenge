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
        "cd-bg": "#050810",
        "cd-panel": "#0c1220",
        "cd-card": "#111827",
        "cd-border": "#1e2d45",
        "cd-green": "#00ff88",
        "cd-blue": "#00b4ff",
        "cd-orange": "#ff6b35",
        "cd-red": "#ff3b5c",
        "cd-text": "#e8f0fe",
        "cd-muted": "#8899aa",
        "cd-dim": "#445566",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        sans: ["Syne", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
