import { LayoutSize } from "@/styles/spacing";
import { useMemo } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

const styles = StyleSheet.create({
  lg: {
    width: 0.2 * LayoutSize.lg,
  },
  md: {
    width: 0.25 * LayoutSize.md,
  },
});

export const useItemHorizontalWidthStyle = () => {
  const { width: windowWidth } = useWindowDimensions();

  const width = useMemo(() => {
    if (windowWidth > LayoutSize.lg) return 0.2 * LayoutSize.lg;
    else if (windowWidth > LayoutSize.md) return 0.25 * LayoutSize.md;
    return Platform.OS === "web" ? "40vw" : 0.4 * windowWidth;
  }, [windowWidth]);

  return useMemo(() => ({ width }), [width]);
};

export const useLargeItemHortizontalWidthStyle = () => {
  const { width: windowWidth } = useWindowDimensions();

  return useMemo(() => {
    if (windowWidth > LayoutSize.lg) return styles.lg;
    else if (windowWidth > LayoutSize.md) return styles.md;
    return { width: Platform.OS === "web" ? "50vw" : 0.5 * windowWidth };
  }, [windowWidth]);
};
