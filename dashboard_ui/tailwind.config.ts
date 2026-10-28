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
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        brand: "var(--color-brand)",
        "brand-hover": "var(--color-brand-hover)",
        "brand-subtle": "var(--color-brand-subtle)",
        "brand-ink": "var(--color-brand-ink)",
        secondary: "var(--color-secondary)",
        reward: "var(--color-reward)",
        // Aliases for compatibility
        "base-0": "var(--color-base-0)",
        "base-1": "var(--color-base-1)",
        stroke: "var(--color-stroke)",
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        plasticity: "var(--color-plasticity)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        doodle: "var(--shadow-doodle)",
        "doodle-sm": "var(--shadow-doodle-sm)",
        "doodle-lg": "var(--shadow-doodle-lg)",
        tactile: "var(--shadow-tactile)",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
