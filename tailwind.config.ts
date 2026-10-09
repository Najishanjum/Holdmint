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
        "surface-dark": "#09090B",
        border: "var(--border)",
        primary: {
          DEFAULT: "var(--primary-text)",
          foreground: "var(--background)",
        },
        muted: {
          DEFAULT: "var(--muted-text)",
          foreground: "var(--muted-text)",
        },
        // Neo-Brutalist Theme Colors
        purple: {
          DEFAULT: "#5919F6",
          primary: "#5919F6",
          electric: "#6C2BFF",
          light: "#F2F0F7",
        },
        yellow: {
          DEFAULT: "#E8FF00",
          acid: "#E8FF00",
        },
        black: {
          DEFAULT: "#050505",
          primary: "#050505",
          card: "#09090B",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        // Financial Semantic Colors
        spend: {
          DEFAULT: "#21D99B",
          foreground: "#050505",
        },
        tax: {
          DEFAULT: "#FFBD45",
          foreground: "#050505",
        },
        savings: {
          DEFAULT: "#8790FF",
          foreground: "#050505",
        },
        danger: {
          DEFAULT: "#F2677A",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Barlow Condensed", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        card: "6px",
        neo: "4px",
      },
      boxShadow: {
        brutal: "4px 4px 0 #050505",
        "brutal-sm": "2px 2px 0 #050505",
        "brutal-lg": "6px 6px 0 #050505",
        "brutal-yellow": "4px 4px 0 #E8FF00",
        "brutal-purple": "4px 4px 0 #5919F6",
        "brutal-white": "4px 4px 0 #FFFFFF",
      },
    },
  },
  plugins: [],
};

export default config;
