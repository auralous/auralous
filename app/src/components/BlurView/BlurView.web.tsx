import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    // @ts-ignore
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export const BlurView: FC<{ style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => {
  return <View style={[styles.root, style]}>{children}</View>;
};
