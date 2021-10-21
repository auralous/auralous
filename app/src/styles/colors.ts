export const Colors = {
  background: "#111422",
  backgroundSecondary: "#1c1f31",
  text: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textTertiary: "rgba(255, 255, 255, 0.5)",
  primary: "#FF2E54",
  primaryDark: "#D12948",
  primaryText: "#FFFFFF",
  control: "#222744",
  controlDark: "#1a1e32",
  border: "rgba(255, 255, 255, 0.05)",
  white: "#FFFFFF",
  black: "#000000",
  none: "transparent",
  danger: "#ff0047",
  success: "#01dc69",
  spotify: "#1db954",
  spotifyLabel: "#FFFFFF",
  youtube: "#FF0000",
  youtubeLabel: "#FFFFFF",
  google: "#FFFFFF",
  googleLabel: "rgba(0, 0, 0, 0.5)",
};

export const GradientColors = {
  rainbow: {
    text: "#ffffff",
    colors: ["#1FF7FD", "#B33BF6", "#FF844C", "#FF844B"],
    locations: [0.1, 0.5, 0.8, 1],
  },
};

export type ThemeColorKey = keyof typeof Colors;
