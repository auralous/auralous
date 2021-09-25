import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const useAnimatedStylePulse = () => {
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

  return useAnimatedStyle(() => ({ opacity: opacityValue.value }), []);
};
