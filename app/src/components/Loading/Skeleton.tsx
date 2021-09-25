import { useAnimatedStylePulse } from "@/animations";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

interface SkeletonBlockProps {
  width?: keyof typeof Size;
  height?: keyof typeof Size;
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.textTertiary,
  },
});

export const SkeletonBlock: FC<SkeletonBlockProps> = ({
  width,
  height,
  style,
}) => {
  const animatedStyle = useAnimatedStylePulse();
  return (
    <Animated.View
      style={[
        styles.root,
        {
          width: width !== undefined ? Size[width] : undefined,
          height: height !== undefined ? Size[height] : undefined,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};
