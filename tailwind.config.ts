import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,js,jsx,html}",
    "./pages/**/*.{ts,tsx,js,jsx,html}",
    "./components/**/*.{ts,tsx,js,jsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        rent1t: {
          lightBg: "#FFFFFF",
          lightSurface: "#F7FAF8",
          lightText: "#0B1410",
          lightBrand: "#16A34A",
          lightBrandAlt: "#22C55E",
          darkBg: "#0B0B0C",
          darkSurface: "#141416",
          darkText: "#EDEDED",
          darkBrand: "#EF4444",
          darkBrandAlt: "#DC2626",
        },
      },
      fontSize: {
        md: ["18px", { lineHeight: "1.7" }],
        lg: ["20px", { lineHeight: "1.7" }],
        xl: ["24px", { lineHeight: "1.4" }],
        "2xl": ["30px", { lineHeight: "1.3" }],
        "3xl": ["36px", { lineHeight: "1.25" }],
        "4xl": ["48px", { lineHeight: "1.15" }],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1280px" },
      },
    },
  },
  plugins: [],
};

export default config;


