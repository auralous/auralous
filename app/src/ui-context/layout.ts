import { LayoutSize } from "@/styles/spacing";
import { useWindowDimensions } from "react-native";

export const use6432Layout = () => {
  const windowWidth = useWindowDimensions().width;
  const numColumns =
    windowWidth >= 1366
      ? 6
      : windowWidth >= LayoutSize.lg
      ? 4
      : windowWidth >= LayoutSize.md
      ? 3
      : 2;
  return numColumns;
};
