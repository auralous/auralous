import { Size } from "@/styles/spacing";
import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    zIndex: 20,
  },
});

const widthToHeightRatio = 16 / 9;
const maxWidth = 356;

export const useYoutubeContainerSizes = () => {
  const windowDimensions = useWindowDimensions();
  const width = Math.min(maxWidth, (windowDimensions.width / 2) * 1.2);
  const height = width / widthToHeightRatio;
  return {
    width,
    height,
  };
};

const PlayerYoutubeContainer: FC<{ style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();

  const { width, height } = useYoutubeContainerSizes();

  const topMin = Size[2] + safeAreaInsets.top;
  const topMax = windowDimensions.height - height - Size[2];
  const rightMin = windowDimensions.width - width - Size[2];
  const rightMax = Size[2];

  const rightAnim = useSharedValue(rightMax);
  const topAnim = useSharedValue(topMax);

  const animStyles = useAnimatedStyle(
    () => ({
      top: topAnim.value,
      right: rightAnim.value,
    }),
    []
  );

  const rightAnimInitial = useSharedValue(rightAnim.value);
  const topAnimInitial = useSharedValue(topAnim.value);

  const animGH = useAnimatedGestureHandler({
    onStart: () => {
      rightAnimInitial.value = rightAnim.value;
      topAnimInitial.value = topAnim.value;
    },
    onActive: (event) => {
      topAnim.value = topAnimInitial.value + event.translationY;
      rightAnim.value = rightAnimInitial.value - event.translationX;
    },
    onFinish: (event) => {
      function clamp(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max);
      }
      topAnim.value = withTiming(clamp(topAnim.value, topMin, topMax));
      if (event.translationX > windowDimensions.width / 4) {
        rightAnim.value = withTiming(rightMax);
      } else if (event.translationX < -windowDimensions.width / 4) {
        rightAnim.value = withTiming(rightMin);
      } else {
        rightAnim.value = withTiming(rightAnimInitial.value);
      }
    },
  });

  return (
    <PanGestureHandler maxPointers={1} minDist={50} onGestureEvent={animGH}>
      <Animated.View
        style={[styles.root, animStyles, { width, height }, style]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default PlayerYoutubeContainer;
