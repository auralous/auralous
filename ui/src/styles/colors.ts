import { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";

export const Colors = {
  background: "#010101",
  backgroundSecondary: "#111111",
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
  youtube: "#FF0000",
  youtubeLabel: "#FFFFFF",
  google: "#FFFFFF",
  googleLabel: "rgba(0, 0, 0, 0.5)",
  border: "rgba(255, 255, 255, 0.1)",
  white: "#FFFFFF",
  black: "#000000",
  none: "transparent",
  danger: "#ff0047",
  success: "#01dc69",
};

export const GradientColors = {
  rainbow: {
    text: "#ffffff",
    colors: ["#1FF7FD", "#B33BF6", "#FF844C", "#FF844B"],
    locations: [0.1, 0.5, 0.8, 1],
  },
};

export type ThemeColorKey = keyof typeof Colors;

const colorCache = new Map<string, string>();

export const useImageColor = (url: string | undefined | null) => {
  const [color, setColor] = useState<string>(Colors.background);

  useEffect(() => {
    if (!url) return setColor(Colors.background);
    const cached = colorCache.get(url);
    if (cached) {
      setColor(cached);
    } else {
      let shouldCommit = true;
      ImageColors.getColors(url)
        .then((colorResult) => {
          if (!shouldCommit) return;
          let result: string;
          switch (colorResult.platform) {
            case "android": {
              result =
                colorResult.vibrant || colorResult.muted || Colors.background;
              break;
            }
            case "ios": {
              result = colorResult.primary;
              break;
            }
            case "web": {
              result =
                colorResult.darkVibrant ||
                colorResult.vibrant ||
                Colors.background;
              break;
            }
            default: {
              result = Colors.background;
            }
          }
          colorCache.set(url, result);
          setColor(result);
        })
        .catch((err) => {
          console.log({ err });
          setColor(Colors.background);
        });
      return () => {
        shouldCommit = false;
      };
    }
  }, [url]);

  return color;
};
