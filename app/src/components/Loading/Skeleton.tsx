import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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
  const opacityValue = useSharedValue(1);

  useEffect(() => {
    opacityValue.value = 1;
    opacityValue.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1
    );
  }, [opacityValue]);

  const animatedStyle = useAnimatedStyle(
    () => ({ opacity: opacityValue.value }),
    []
  );

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
