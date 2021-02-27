const allowedSizing = [0, 1, 2, 4, 8, 10, 12, 16];

const colors = {
  background: {
    DEFAULT: "var(--background)",
    secondary: "var(--background-secondary)",
    tertiary: "var(--background-tertiary)",
  },
  control: {
    DEFAULT: "var(--control)",
    dark: "var(--control-dark)",
  },
  foreground: {
    DEFAULT: "var(--foreground)",
    secondary: "var(--foreground-secondary)",
    tertiary: "var(--foreground-tertiary)",
  },
  danger: {
    DEFAULT: "var(--danger)",
    light: "var(--danger-light)",
    dark: "var(--danger-dark)",
    label: "var(--danger-label)",
  },
  primary: {
    DEFAULT: "var(--primary)",
    dark: "var(--primary-dark)",
    label: "var(--primary-label)",
  },
  secondary: {
    DEFAULT: "var(--secondary)",
    light: "var(--secondary-light)",
    dark: "var(--secondary-dark)",
    label: "var(--secondary-label)",
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
        ...[0, 1, 2, 4, 6, 8]
          .map((p) => [`p-${p}`, `px-${p}`, `py-${p}`])
          .flat(),
        ...[0, 1, 2, 4, 6, 8]
          .map((s) => [`space-x-${s}`, `space-y-${s}`])
          .flat(),
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
