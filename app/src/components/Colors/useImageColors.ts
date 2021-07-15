import { useColors } from "@auralous/ui";
import { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";

const colorCache = new Map<string, string>();

export const useImageColor = (url: string | undefined | null) => {
  const colors = useColors();

  const [color, setColor] = useState<string>(colors.background);

  useEffect(() => {
    if (!url) return setColor(colors.background);
    const cached = colorCache.get(url);
    if (cached) {
      setColor(cached);
    } else {
      let shouldCommit = true;
      ImageColors.getColors(url)
        .then((colorResult) => {
          if (!shouldCommit) return;
          let result: string;
          if (colorResult.platform === "android") {
            result = colorResult.vibrant || colors.background;
          } else {
            result = colorResult.primary;
          }
          colorCache.set(url, result);
          setColor(result);
        })
        .catch(() => {
          setColor(colors.background);
        });
      return () => {
        shouldCommit = false;
      };
    }
  }, [url, colors]);

  return color;
};
