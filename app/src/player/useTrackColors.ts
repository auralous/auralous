import { useTrackQuery } from "@/gql/gql.gen";
import { useColors } from "@/styles";
import { useEffect, useMemo, useState } from "react";
import ImageColors from "react-native-image-colors";

export const useTrackColors = (trackId?: string | null) => {
  const [{ data, stale }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });
  const image = !stale ? data?.track?.image : undefined;

  const colors = useColors();

  const defaultGradients = useMemo(
    () => [colors.backgroundSecondary, colors.background] as [string, string],
    [colors]
  );

  const [gradientColors, setGradientColors] = useState<[string, string]>(
    defaultGradients
  );

  useEffect(() => {
    if (!image) return setGradientColors(defaultGradients);
    let shouldCommit = true;
    ImageColors.getColors(image)
      .then((colorResult) => {
        if (!shouldCommit) return;
        let color1 = defaultGradients[0];
        let color2 = defaultGradients[1];
        if (colorResult.platform === "android") {
          color1 = colorResult.vibrant || color2;
          color2 = colorResult.darkVibrant || color1;
        } else {
          color1 = colorResult.secondary || color2;
          color2 = colorResult.primary || color1;
        }
        setGradientColors([color1, color2]);
      })
      .catch(() => {
        setGradientColors(defaultGradients);
      });
    return () => {
      shouldCommit = false;
    };
  }, [image, defaultGradients]);

  return gradientColors;
};
