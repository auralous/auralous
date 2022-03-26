import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

interface SpacerProps {
  x?: keyof typeof Size;
  y?: keyof typeof Size;
  style?: StyleProp<ViewStyle>;
}

const Spacer: FC<SpacerProps> = ({ x, y, style }) => {
  const spacer = useRef({
    width: x ? Size[x] : 1,
    height: y ? Size[y] : 1,
  }).current;

  return (
    <View
      style={StyleSheet.compose(spacer as ViewStyle, style)}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    />
  );
};

export default Spacer;
