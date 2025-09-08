// Export a plain object for reference to avoid importing Chakra theming APIs
const theme = {
  semanticTokens: {
    colors: {
      bg: { default: "#FFFFFF", _dark: "#0B0B0C" },
      surface: { default: "#F7FAF8", _dark: "#141416" },
      text: { default: "#14532D", _dark: "#FCA5A5" },
      accent: { default: "#16A34A", _dark: "#EF4444" },
      accentHover: { default: "#15803D", _dark: "#DC2626" },
      muted: { default: "#6B7280", _dark: "#9CA3AF" },
      ring: { default: "#16A34A", _dark: "#EF4444" },
      brand: { default: "#16A34A", _dark: "#EF4444" },
    },
  },
  fonts: {
    heading: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, Helvetica, Arial",
    body: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, Helvetica, Arial",
  },
  fontSizes: {
    sm: "16px",
    md: "18px",
    lg: "20px",
    xl: "24px",
    "2xl": "30px",
    "3xl": "36px",
    "4xl": "48px",
    "5xl": "60px",
    "6xl": "72px",
  },
  lineHeights: { normal: 1.6, snug: 1.35, tight: 1.1 },
  space: { 1: "6px", 2: "10px", 3: "14px", 4: "18px", 5: "22px", 6: "26px", 7: "32px", 8: "40px", 9: "48px", 10: "56px" },
} as const;

export default theme;


