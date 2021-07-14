import { Maybe, Track } from "@auralous/api";
import { IconMenu } from "@auralous/ui/assets";
import { Checkbox } from "@auralous/ui/components/Checkbox";
import { Size } from "@auralous/ui/styles";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import TrackItem from "./TrackItem";

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

interface QueueTrackItemProps {
  uid: string;
  track: Maybe<Track>;
  fetching?: boolean;
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
        <TrackItem track={track} fetching={fetching} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPressIn={drag} style={styles.drag}>
        <IconMenu />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default QueueTrackItem;
