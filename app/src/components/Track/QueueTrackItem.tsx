import { IconMenu } from "@/assets";
import { Checkbox } from "@/components/Checkbox";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useMemo } from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import type { AnimatedStyleProp } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import type { TrackItemProps } from "./TrackItem";
import TrackItem from "./TrackItem";

const styles = StyleSheet.create({
  check: {
    justifyContent: "center",
  },
  drag: {
    alignItems: "center",
    height: Size[12],
    justifyContent: "center",
    width: Size[12],
  },
  dragging: {
    opacity: 0.5,
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  track: {
    flex: 1,
    overflow: "hidden",
    paddingHorizontal: Size[2],
  },
});

interface QueueTrackItemProps extends TrackItemProps {
  uid: string;
  drag(): void;
  checked: boolean;
  onToggle(checked: boolean): void;
  onPress?(uid: string): void;
  dragging: boolean;
  style?: ViewStyle;
}

const QueueTrackItem: FC<
  QueueTrackItemProps & { animStyle?: AnimatedStyleProp<ViewStyle> }
> = ({
  uid,
  drag,
  checked,
  onToggle,
  onPress,
  animStyle,
  dragging,
  style,
  ...props
}) => {
  const onTrackItemPressed = useMemo(() => {
    if (!onPress || !uid) return undefined;
    return () => onPress(uid);
  }, [onPress, uid]);
  return (
    <Animated.View
      style={[styles.root, style, animStyle, dragging && styles.dragging]}
    >
      <View style={styles.check}>
        <Checkbox size={Size[12]} checked={checked} onValueChange={onToggle} />
      </View>
      <TouchableOpacity
        style={styles.track}
        onPress={onTrackItemPressed}
        activeOpacity={onPress ? 0.2 : 1}
      >
        <TrackItem {...props} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPressIn={drag} style={styles.drag}>
        <IconMenu />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default QueueTrackItem;
