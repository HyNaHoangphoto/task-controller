import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#131314",
        panel: "#1a1b1c",
        card: "#1f2020",
        border: "#2a2b2c",
        muted: "#abadb0",
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
