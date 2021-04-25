import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1]),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        { backgroundColor: "rgba(0,0,0,.8)" },
        containerAnimatedStyle,
      ]}
    />
  );
};

export default CustomBackdrop;
