import { Size } from "@/styles";
import type { FC } from "react";
import { memo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

interface SpacerProps {
  x?: keyof typeof Size;
  y?: keyof typeof Size;
  style?: StyleProp<ViewStyle>;
}

const Spacer: FC<SpacerProps> = ({ x, y, style }) => {
  return (
    <View
      style={StyleSheet.compose(
        {
          width: x ? Size[x] : 1,
          height: y ? Size[y] : 1,
        },
        style
      )}
    />
  );
};

export default memo(Spacer);
