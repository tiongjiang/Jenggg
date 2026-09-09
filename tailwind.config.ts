import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bau: {
          blue: "#2251FF",
          red: "#FF3B30",
          yellow: "#FFCC00",
          green: "#00B368",
          black: "#141416",
          cream: "#FFFDF7",
          dim: "#F4EEDC",
        },
        sao: {
          cyan: "#56E2FF",
          dark: "rgba(14, 22, 38, 0.96)",
        },
        tier: {
          jeng: "#FFCC00",
          hociakk: "#00B368",
          mamadei: "#F4EEDC",
          hmmm: "#A0A4B8",
          ewww: "#7B3294",
        }
      },
      fontFamily: {
        baloo: ["'Baloo 2'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
        space: ["'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        bau: "4px 4px 0px #141416",
        "bau-sm": "2px 2px 0px #141416",
        "bau-lg": "6px 6px 0px #141416",
        sao: "0 0 16px rgba(86, 226, 255, 0.45)",
      },
      borderWidth: {
        bau: "2.5px",
      }
    },
  },
  plugins: [],
};
export default config;
