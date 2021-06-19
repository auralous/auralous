import { Maybe, Track } from "@auralous/api";
import type { Player } from "@auralous/player";
import { Text } from "@auralous/ui/components/Typography";
import { Size } from "@auralous/ui/styles";
import { msToHMS } from "@auralous/ui/utils";
import { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    height: Size[1],
    backgroundColor: "rgba(255,255,255,.1)",
    borderRadius: 9999,
    marginTop: 20,
    marginBottom: Size[4],
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    height: Size[1],
    backgroundColor: "white",
    borderRadius: 9999,
  },
  texts: {
    position: "absolute",
    top: Size[2],
    left: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

const PlayerViewProgress: FC<{
  track: Maybe<Track> | undefined;
  player: Player;
}> = ({ track, player }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const onTime = (ms: number) => setCurrent(ms);
    player.on("time", onTime);
    return () => player.off("time", onTime);
  }, [player]);

  useEffect(() => {
    setCurrent(0);
  }, [track]);

  const duration = track?.duration || 0;
  const progressPerc = duration && `${(current / duration) * 100}%`;

  const parsedDuration = msToHMS(duration, true);
  const parsedCurrent = msToHMS(current, true);

  return (
    <View style={styles.root}>
      <View style={[styles.indicator, { width: progressPerc }]} />
      <View style={styles.texts}>
        <Text size="sm" color="textTertiary">
          {parsedCurrent[1]}:{parsedCurrent[0]}
        </Text>
        <Text size="sm" color="textTertiary">
          {parsedDuration[1]}:{parsedDuration[0]}
        </Text>
      </View>
    </View>
  );
};

export default PlayerViewProgress;
