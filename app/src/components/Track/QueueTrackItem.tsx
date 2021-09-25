import { IconMenu } from "@/assets";
import { Checkbox } from "@/components/Checkbox";
import { TrackItem } from "@/components/Track";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { TrackItemProps } from "./TrackItem";

const styles = StyleSheet.create({
  check: {
    height: Size[12],
    justifyContent: "center",
    paddingHorizontal: Size[2],
  },
  drag: {
    alignItems: "center",
    height: Size[12],
    justifyContent: "center",
    width: Size[12],
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    padding: Size[1],
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
}

const QueueTrackItem: FC<QueueTrackItemProps> = ({
  uid,
  track,
  fetching,
  drag,
  checked,
  onToggle,
  onPress,
  isPlaying,
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
        onPress={onTrackItemPressed}
        activeOpacity={onPress ? 0.2 : 1}
      >
        <TrackItem isPlaying={isPlaying} track={track} fetching={fetching} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPressIn={drag} style={styles.drag}>
        <IconMenu />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default QueueTrackItem;
