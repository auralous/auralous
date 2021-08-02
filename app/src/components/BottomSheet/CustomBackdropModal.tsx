import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const CustomBackdropModal = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [-1, 0],
        [0, 0.75],
        Extrapolate.CLAMP
      ),
    };
  });

  // styles
  const containerStyle = useMemo(
    () => [style, { backgroundColor: "#000000" }, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View style={containerStyle} />;
};

export default CustomBackdropModal;
