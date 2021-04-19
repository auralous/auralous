import create from "zustand";

export const Colors = {
  background: "#121421",
  backgroundSecondary: "#1C2031",
  text: "#FFFFFF",
  textSecondary: "rgba(235, 325, 245, 0.6)",
  textTertiary: "rgba(235, 235, 245, 0.3)",
  primary: "#FF2E54",
  primaryDark: "#D12948",
  primaryText: "#FFFFFF",
  control: "#FFFFFF",
  controlDark: "#F2F2F7",
  controlText: "#2F2F2F",
  spotify: "#1db954",
  spotifyLabel: "#FFFFFF",
  google: "#FFFFFF",
  googleLabel: "rgba(0, 0, 0, 0.5)",
};

export type ThemeColor = keyof typeof Colors;

// ColorsLight = {}

export const useStore = create(() => ({
  colors: Colors,
}));

export const useColors = () => useStore((state) => state.colors);
