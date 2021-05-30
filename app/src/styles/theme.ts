import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

const Colors = {
  background: "#010101",
  backgroundSecondary: "#0C0C0C",
  text: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  textTertiary: "rgba(255, 255, 255, 0.3)",
  primary: "#FF2E54",
  primaryDark: "#D12948",
  primaryText: "#FFFFFF",
  control: "rgba(255, 255, 255, 0.2)",
  controlDark: "rgba(255, 255, 255, 0.1)",
  spotify: "#1db954",
  spotifyLabel: "#FFFFFF",
  google: "#FFFFFF",
  googleLabel: "rgba(0, 0, 0, 0.5)",
  gradientRainbow: {
    colors: ["#1FF7FD", "#B33BF6", "#FF844C", "#FF844B"],
    locations: [0.1, 0.5, 0.8, 1],
  },
};

export type ThemeColor = keyof typeof Colors;

// ColorsLight = {}

type IThemeContext = {
  colors: typeof Colors;
};

const ThemeContext = createContext<IThemeContext>({
  colors: Colors,
});

const colorSelector = (v: IThemeContext) => v.colors;

export const useColors = () => useContextSelector(ThemeContext, colorSelector);
