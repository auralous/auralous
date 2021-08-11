import { imageSources, SvgByPlatformName } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import { msToHMS } from "@/utils";
import { Maybe, Track } from "@auralous/api";
import { FC, memo, useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";

export interface TrackItemProps {
  track: Maybe<Track>;
  fetching?: boolean;
  active?: boolean;
}

const styles = StyleSheet.create({
  image: {
    height: Size[12],
    width: Size[12],
  },
  meta: {
    flex: 1,
    paddingLeft: Size[3],
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
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
              fill={Colors.text}
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
