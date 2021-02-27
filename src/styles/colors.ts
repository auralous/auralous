import { StyleSheet, ViewStyle } from "react-native";

const colors = {
  background: "hsl(265,39%,5%)",
  backgroundSecondary: "hsl(266,44%,7%)",
  backgroundTertiary: "hsl(264,43%,9%)",
  backgroundBar: "hsl(265,43%,11%)",
  backgroundBackdrop: "hsla(265,43%,5%,75%)",
  button: "hsl(264,35%,13%)",
  buttonDark: "hsl(264,35%,9%)",
  foreground: "hsl(270,4%,91%)",
  foregroundSecondary: "hsla(270,4%,91%,85%)",
  foregroundTertiary: "hsla(270,4%,91%,70%)",
  foregroundBackdrop: "hsla(263,20%,18%,50%)",
  danger: "#d7373f",
  dangerLight: "#e34850",
  dangerDark: "#c9252d",
  dangerLabel: "#fff",
  primary: "hsl(349,100%,59%)",
  primaryDark: "hsl(349,67%,49%)",
  primaryLabel: "#fff",
  secondary: "hsl(37,91%,55%)",
  secondaryLight: "hsl(37,91%,65%)",
  secondaryDark: "hsl(37,91%,50%)",
  secondaryLabel: "#000",
  black: "#000",
  white: "#fff",
  transparent: "transparent",
  youtube: "#f00",
  youtubeLabel: "#fff",
  spotify: "#1db954",
  spotifyLabel: "#fff",
} as const;

export type Color = keyof typeof colors;

const bg = {} as Record<Color, ViewStyle>;
Object.keys(colors).forEach((bgKey) => {
  bg[bgKey as Color] = {
    backgroundColor: colors[bgKey as Color],
  };
});

export const stylesBackground = StyleSheet.create(bg);

export default colors;
