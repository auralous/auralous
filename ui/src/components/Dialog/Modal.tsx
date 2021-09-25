import type { FC } from "react";
import { useEffect, useState } from "react";
import { Modal } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface SlideModalProps {
  visible: boolean;
  onDismiss?(): void;
}

export const SlideModal: FC<SlideModalProps> = ({
  visible,
  onDismiss,
  children,
}) => {
  const [mount, setMount] = useState(false);
  const bottomValue = useSharedValue(-100);

  useEffect(() => {
    if (visible) {
      setMount(true);
      bottomValue.value = withTiming(0);
    } else {
      bottomValue.value = withTiming(-100, undefined, (isFinished) => {
        if (isFinished) runOnJS(setMount)(false);
      });
    }
  }, [visible, bottomValue]);

  // const contentStyle = useAnimatedStyle(
  //   () => ({
  //     flex: 1,
  //     bottom: (sharedValue.value - 1) * 100 + "%",
  //   }),
  //   []
  // );

  const contentStyle = useAnimatedStyle(
    () => ({
      flex: 1,
      bottom: bottomValue.value + "%",
    }),
    []
  );

  return (
    <Modal
      visible={mount}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </Modal>
  );
};
