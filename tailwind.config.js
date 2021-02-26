const allowedSizing = [0, 1, 2, 4, 8, 10, 12, 16];

const colors = {
  background: {
    DEFAULT: "hsl(265deg 39% 5%)",
    secondary: "hsl(266deg 44% 7%)",
    tertiary: "hsl(264deg 43% 9%)",
    bar: "hsl(265deg 43% 11%)",
    backdrop: "hsla(265deg 43% 5% / 75%)",
  },
  button: {
    DEFAULT: "hsl(264deg 35% 13%)",
    dark: "hsl(264deg 35% 9%)",
  },
  foreground: {
    DEFAULT: "hsl(270deg 4% 91%)",
    secondary: "hsla(270deg 4% 91% / 85%)",
    tertiary: "hsla(270deg 4% 91% / 70%)",
    backdrop: "hsla(263deg 20% 18% / 50%)",
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
};

const colorSafelistKeys = Object.entries(colors)
  .map(([key, value]) => {
    if (typeof value === "object")
      return Object.keys(value).map(
        (c) => `${key}${c === "DEFAULT" ? "" : `-${c}`}`
      );
    return key;
  })
  .flat();

module.exports = {
  important: true,
  purge: {
    content: ["./src/**/*.tsx"],
    options: {
      safelist: [
        ...colorSafelistKeys.map((ck) => `bg-${ck}`),
        ...colorSafelistKeys.map((ck) => `text-${ck}`),
        ...allowedSizing.map((u) => `w-${u}`),
        "w-20",
        "w-32",
        "w-40",
        "w-full",
        "min-w-0",
        "max-w-xl",
        "max-w-2xl",
        "max-w-4xl",
        ...allowedSizing.map((u) => `h-${u}`),
        "h-full",
        "min-h-0",
        ...allowedSizing.map((u) => `top-${u}`),
        ...allowedSizing.map((u) => `bottom-${u}`),
        ...allowedSizing.map((u) => `left-${u}`),
        ...allowedSizing.map((u) => `right-${u}`),
        ...["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"].map(
          (s) => `text-${s}`
        ),
        "text-center",
        "text-left",
        "text-right",
        "justify-start",
        "justify-end",
        "justify-center",
        "justify-between",
        "justify-around",
        "justify-evenly",
        "items-stretch",
        "items-end",
        "items-start",
        "items-center",
        "items-baseline",
        ...[1, 2, 4, 6, 8].map((s) => `space-x-${s}`),
        ...[1, 2, 4, 6, 8].map((s) => `space-y-${s}`),
      ],
    },
  },
  darkMode: false,
  corePlugins: {
    float: false,
    clear: false,
    backgroundOpacity: false,
    textOpacity: false,
    borderOpacity: false,
    container: false,
  },
  theme: {
    colors,
    fontWeight: {
      normal: 400,
      bold: 700,
    },
    opacity: {
      0: "0",
      25: "0.25",
      50: "0.5",
      75: "0.75",
      100: "1",
    },
  },
  variants: {
    extend: {},
  },
};
