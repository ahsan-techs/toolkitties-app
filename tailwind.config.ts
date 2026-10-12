import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F3",
        ink: "#15171A",
        moss: "#1F5C4C",
        gold: "#C7862B",
        sand: "#EAE7DE",
        slate: "#5B5D63",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        wave1: "wave 1s ease-in-out infinite",
        wave2: "wave 1s ease-in-out infinite 0.15s",
        wave3: "wave 1s ease-in-out infinite 0.3s",
        wave4: "wave 1s ease-in-out infinite 0.45s",
        rise: "rise 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
