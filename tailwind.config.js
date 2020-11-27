module.exports = {
  important: true,
  purge: ["./src/**/*.tsx"],
  darkMode: false,
  theme: {
    colors: {
      background: {
        DEFAULT: "#000c1e",
        secondary: "rgba(255,255,255,.1)",
        tertiary: "rgba(255,255,255,.2)",
      },
      foreground: {
        DEFAULT: "#fff",
        secondary: "rgba(255,255,255,.6)",
        tertiary: "rgba(255,255,255,.4)",
      },
      danger: {
        DEFAULT: "#e00",
        light: "#ff1a1a",
        dark: "#c00",
        label: "#fff",
      },
      success: {
        DEFAULT: "#0070f3",
        light: "#3291ff",
        dark: "#0366d6",
        label: "#fff",
      },
      warning: {
        DEFAULT: "#f5a623",
        light: "#f7b955",
        dark: "#f49b0b",
        label: "#000",
      },
      pink: {
        DEFAULT: "#d74d49",
        dark: "#ce4a4a",
        label: "#fff",
      },
      black: "#000",
      white: "#fff",
      transparent: "transparent",
      blue: {
        DEFAULT: "#090e1f",
        secondary: "#001431",
        tertiary: "#303a60",
      },
    },
    extend: {
      spacing: {
        full: "100%",
        "4/3": "133.33%",
      },
      animation: {
        "spin-slow": "spin 9s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
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
