import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import { msToHMS } from "@/utils";
import type { Maybe, Track } from "@auralous/api";
import type { Player } from "@auralous/player";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: Colors.white,
    borderRadius: 9999,
    height: Size[1],
    left: 0,
    position: "absolute",
    top: 0,
  },
  live: {
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  liveText: {
    color: Colors.primaryText,
    textTransform: "uppercase",
  },
  root: {
    backgroundColor: "rgba(255,255,255,.1)",
    borderRadius: 9999,
    height: Size[1],
    marginBottom: Size[4],
    marginTop: 20,
  },
  rootLive: {
    alignItems: "center",
    marginBottom: Size[4],
    marginTop: 20,
  },
  texts: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    position: "absolute",
    top: Size[2],
    width: "100%",
  },
});

const PlayerViewProgressOnDemand: FC<{
  track: Maybe<Track> | undefined;
  player: Player;
}> = ({ player, track }) => {
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

const PlayerViewProgressLive: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.rootLive}>
      <View style={styles.live}>
        <Text size="xs" style={styles.liveText}>
          {t("common.status.live")}
        </Text>
      </View>
    </View>
  );
};

const PlayerViewProgress: FC<{
  track: Maybe<Track> | undefined;
  player: Player;
  isLive: boolean;
}> = ({ track, player, isLive }) => {
  if (isLive) return <PlayerViewProgressLive />;
  return <PlayerViewProgressOnDemand track={track} player={player} />;
};

export default PlayerViewProgress;
