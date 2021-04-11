import create from "zustand";

export const Colors = {
  background: "#000000",
  backgroundSecondary: "#080808",
  text: "hsla(0, 0%, 100%, 0.85)",
  textSecondary: "hsla(0, 0%, 100%, 0.6)",
  textTertiary: "hsla(0, 0%, 100%, 0.35)",
  primary: "#ff2e54",
  primaryDark: "#d12948",
  primaryText: "hsla(0, 0%, 100%, 0.85)",
  control: "#191a20",
  controlDark: "#0f1016",
  controlText: "hsla(0, 0%, 100%, 0.85)",
};

export type ThemeColor = keyof typeof Colors;

// ColorsLight = {}

export const useStore = create(() => ({
  colors: Colors,
}));

export const useColors = () => useStore((state) => state.colors);
