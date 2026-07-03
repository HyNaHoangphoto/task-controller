import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        panel: "var(--color-panel)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
        text: "var(--color-text)",
        accent: {
          DEFAULT: "#34a853",
          light: "#5be58a",
        },
        warn: "#f2b84b",
        danger: "#f28b82",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(90deg,#5be58a,#34a853)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
