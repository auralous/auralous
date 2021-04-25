import create from "zustand";

const Colors = {
  background: "#191925",
  backgroundSecondary: "#222433",
  text: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  textTertiary: "rgba(255, 255, 255, 0.3)",
  primary: "#FF2E54",
  primaryDark: "#D12948",
  primaryText: "#FFFFFF",
  control: "#FFFFFF",
  controlDark: "#F2F2F7",
  controlText: "#2F2F2F",
  input: "#343649",
  inputFocused: "#232536",
  inputText: "rgba(255, 255, 255, 0.6)",
  spotify: "#1db954",
  spotifyLabel: "#FFFFFF",
  google: "#FFFFFF",
  googleLabel: "rgba(0, 0, 0, 0.5)",
  outline: "rgba(103,126,186,.08)",
};

export type ThemeColor = keyof typeof Colors;

// ColorsLight = {}

export const useStore = create(() => ({
  colors: Colors,
}));

export const useColors = () => useStore((state) => state.colors);
