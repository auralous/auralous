/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  important: true,
  purge: ["./src/**/*.tsx"],
  theme: {
    colors: {
      background: {
        default: "#000c1e",
        secondary: "rgba(255,255,255,.1)",
        tertiary: "rgba(255,255,255,.2)",
      },
      foreground: {
        default: "#fff",
        secondary: "rgba(255,255,255,.6)",
        tertiary: "rgba(255,255,255,.4)",
      },
      danger: {
        default: "#e00",
        light: "#ff1a1a",
        dark: "#c00",
        label: "#fff",
      },
      success: {
        default: "#0070f3",
        light: "#3291ff",
        dark: "#0366d6",
        label: "#fff",
      },
      warning: {
        default: "#f5a623",
        light: "#f7b955",
        dark: "#f49b0b",
        label: "#000",
      },
      pink: "#d74d49",
      black: "#000",
      white: "#fff",
      transparent: "transparent",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      variants: {
        opacity: ["responsive", "hover"],
      },
      spacing: {
        full: "100%",
        72: "18rem",
        96: "24rem",
        "1/7": "14.2857%",
        "1/8": "12.5%",
        "9/16": "56.25%",
        "4/3": "133.33%",
      },
      width: {
        72: "18rem",
        96: "24rem",
        128: "32rem",
      },
      height: {
        72: "18rem",
        96: "24rem",
        128: "32rem",
      },
      minWidth: defaultTheme.width,
      maxWidth: defaultTheme.width,
      minHeight: defaultTheme.height,
      maxHeight: defaultTheme.height,
      inset: defaultTheme.width,
      opacity: {
        10: "0.1",
      },
      animation: {
        "spin-slow": "spin 9s linear infinite",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  experimental: {
    applyComplexClasses: true,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "calc(100vw - 1.4rem)",
          margin: "0 auto",
          "@screen sm": {
            maxWidth: "calc(100vw - 1.4rem)",
          },
          "@screen md": {
            maxWidth: "calc(100vw - 2.8rem)",
          },
          "@screen lg": {
            maxWidth: "calc(100vw - 5.6rem)",
          },
        },
      });
    },
  ],
};
