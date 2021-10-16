import { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "./colors";

const outputRange = [0, 1];

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
      ImageColors.getColors(url, { fallback: Colors.background, cache: true })
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
        .catch(() => {
          setColor(Colors.background);
        });
      return () => {
        shouldCommit = false;
      };
    }
  }, [url]);

  return color;
};

export const useAnimatedBgColors = (currentColor: string) => {
  const [colors, setColors] = useState([currentColor, currentColor]);

  const colorValue = useSharedValue(0);

  useEffect(() => {
    colorValue.value = 0;
    colorValue.value = withTiming(1, { duration: 400 });
  }, [colors, colorValue]);

  useEffect(() => {
    setColors((prevValues) => [prevValues[1], currentColor]);
  }, [currentColor, colorValue]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(colorValue.value, outputRange, colors),
    }),
    [colors, colorValue]
  );

  return animatedStyle;
};
