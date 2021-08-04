import { IconMenu } from "@/assets";
import { Checkbox } from "@/components/Checkbox";
import { Size } from "@/styles";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import TrackItem, { TrackItemProps } from "./TrackItem";

const styles = StyleSheet.create({
  root: {
    width: "100%",
    padding: Size[1],
    flexDirection: "row",
    alignItems: "center",
  },
  track: {
    flex: 1,
    paddingHorizontal: Size[2],
    overflow: "hidden",
  },
  tContainer: {
    flex: 1,
  },
  check: {
    height: Size[12],
    paddingHorizontal: Size[2],
    justifyContent: "center",
  },
  drag: {
    width: Size[12],
    height: Size[12],
    alignItems: "center",
    justifyContent: "center",
  },
});

interface QueueTrackItemProps extends TrackItemProps {
  uid: string;
  drag(): void;
  checked: boolean;
  onToggle(checked: boolean): void;
  onPress?(uid: string): void;
}

const QueueTrackItem: FC<QueueTrackItemProps> = ({
  uid,
  track,
  fetching,
  drag,
  checked,
  onToggle,
  onPress,
  active,
}) => {
  const onTrackItemPressed = useMemo(() => {
    if (!onPress || !uid) return undefined;
    return () => onPress(uid);
  }, [onPress, uid]);
  return (
    <View style={styles.root}>
      <View style={styles.check}>
        <Checkbox checked={checked} onValueChange={onToggle} />
      </View>
      <TouchableOpacity
        style={styles.track}
        containerStyle={styles.tContainer}
        onPress={onTrackItemPressed}
        activeOpacity={onPress ? 0.2 : 1}
      >
        <TrackItem active={active} track={track} fetching={fetching} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPressIn={drag} style={styles.drag}>
        <IconMenu />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default QueueTrackItem;
