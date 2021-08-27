import { Colors } from "@auralous/ui";
import { useEffect, useState } from "react";
import ImageColors from "react-native-image-colors";

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
          if (colorResult.platform === "android") {
            result = colorResult.vibrant || Colors.background;
          } else {
            result = colorResult.primary;
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
