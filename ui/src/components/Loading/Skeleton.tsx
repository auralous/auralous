import { useAnimatedStylePulse } from "@/animations";
import { Colors, Size } from "@/styles";
import { FC } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
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
