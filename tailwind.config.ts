import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#EA580C", // Industrial Amber
          "primary-hover": "#C2410C",
          "primary-light": "#FFEDD5",
          base: "#0F172A", // Slate 900
          slate: "#1E293B", // Slate 800
          accent: "#10B981", // Emerald Green
          "accent-dark": "#059669",
          "accent-light": "#D1FAE5",
          bg: "#F8FAFC", // Background
          card: "#FFFFFF",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
        "card-hover": "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)",
        badge: "0 2px 4px 0 rgba(16, 185, 129, 0.15)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
export default config;
