import { SvgByPlatformName } from "assets/svg/constants";
import { Spacer } from "components/Spacer";
import { Text } from "components/Typography";
import { Maybe, Track } from "gql/gql.gen";
import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Size, useColors } from "styles";
import { msToHMS } from "utils/ms";

interface TrackItemProps {
  track: Maybe<Track>;
  loading?: boolean;
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: Size[12],
    height: Size[12],
  },
  meta: {
    flex: 1,
  },
});

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
  const durationStr = useMemo(() => {
    if (!track) return "";
    const [sec, min] = msToHMS(track.duration, true);
    return `${min}:${sec}`;
  }, [track]);

  const SvgPlatformName = track?.platform
    ? SvgByPlatformName[track.platform]
    : null;

  const colors = useColors();

  return (
    <View style={styles.root}>
      <Image style={styles.image} source={{ uri: track?.image }} />
      <Spacer x={2} />
      <View style={styles.meta}>
        <View style={styles.title}>
          {SvgPlatformName && (
            <SvgPlatformName
              width={Size[4]}
              height={Size[4]}
              fill={colors.text}
            />
          )}
          <Spacer x={1} />
          <Text bold numberOfLines={1}>
            {track?.title}
          </Text>
        </View>
        <Text color="textSecondary" size="sm" numberOfLines={1}>
          {durationStr}
          {" • "}
          {track?.artists.map(({ name }) => name).join(", ")}
        </Text>
      </View>
    </View>
  );
};

export default TrackItem;
