import { Maybe, Track } from "@auralous/api";
import { imageSources, SvgByPlatformName } from "@auralous/ui/assets";
import { Spacer } from "@auralous/ui/components/Spacer";
import { Text } from "@auralous/ui/components/Typography";
import { Size, useColors } from "@auralous/ui/styles";
import { msToHMS } from "@auralous/ui/utils";
import { FC, memo, useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";

export interface TrackItemProps {
  track: Maybe<Track>;
  fetching?: boolean;
  active?: boolean;
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
    paddingLeft: Size[3],
  },
  playing: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

const TrackItem: FC<TrackItemProps> = ({ track }) => {
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
      <View>
        <Image
          style={styles.image}
          source={
            track?.image ? { uri: track?.image } : imageSources.defaultTrack
          }
          defaultSource={imageSources.defaultTrack}
          accessibilityLabel={track?.title}
        />
      </View>
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

export default memo(TrackItem);
