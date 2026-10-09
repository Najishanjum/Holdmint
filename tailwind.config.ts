import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        primary: {
          DEFAULT: "var(--primary-text)",
          foreground: "var(--background)",
        },
        muted: {
          DEFAULT: "var(--muted-text)",
          foreground: "var(--muted-text)",
        },
        spend: {
          DEFAULT: "var(--spend-green)",
          foreground: "#0B0F14",
        },
        tax: {
          DEFAULT: "var(--tax-amber)",
          foreground: "#0B0F14",
        },
        savings: {
          DEFAULT: "var(--savings-periwinkle)",
          foreground: "#0B0F14",
        },
        danger: {
          DEFAULT: "var(--danger-coral)",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        card: "16px",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
