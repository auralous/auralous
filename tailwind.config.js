module.exports = {
  important: true,
  purge: {
    content: ["./src/**/*.tsx"],
    options: {
      safelist: ["text-spotify", "text-youtube", "bg-youtube", "bg-spotify"],
    },
  },
  darkMode: false,
  theme: {
    colors: {
      background: {
        DEFAULT: "hsl(240,14%,10%)",
        secondary: "hsl(232,12%,13%)",
        tertiary: "hsl(228,13%,15%)",
        backdrop: "hsla(218,80%,2%,0.8)",
      },
      foreground: {
        DEFAULT: "hsl(0,0%,100%)",
        secondary: "hsla(0,0%,100%,.6)",
        tertiary: "hsla(0,0%,100%,.4)",
        backdrop: "hsla(0,0%,100%,.2)",
      },
      danger: {
        DEFAULT: "#d7373f",
        light: "#e34850",
        dark: "#c9252d",
        label: "#fff",
      },
      primary: {
        DEFAULT: "hsl(349,100%,59%)",
        dark: "hsl(349,67%,49%)",
        label: "#fff",
      },
      secondary: {
        DEFAULT: "hsl(37,91%,55%)",
        light: "hsl(37,91%,65%)",
        dark: "hsl(37,91%,50%)",
        label: "#000",
      },
      black: "#000",
      white: "#fff",
      transparent: "transparent",
      youtube: {
        DEFAULT: "#f00",
        label: "#fff",
      },
      spotify: {
        DEFAULT: "#1db954",
        label: "#fff",
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
