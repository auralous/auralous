import { IconByPlatformName } from "@/assets";
import imageDefaultTrack from "@/assets/images/default_track.jpg";
import imageIconPlaying from "@/assets/images/icon-playing.gif";
import { Image } from "@/components/Image";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import { msToHMS } from "@/utils/ms";
import type { Maybe, Track } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export interface TrackItemProps {
  track: Maybe<Track>;
  fetching?: boolean;
  isPlaying?: boolean;
  hideImage?: boolean;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: Size[1],
    height: Size[1] * 11,
    overflow: "hidden",
    width: Size[1] * 11,
  },
  isPlaying: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .5)",
    justifyContent: "center",
    padding: Size[4],
  },
  isPlayingIcon: {
    height: "100%",
    width: "100%",
  },
  meta: {
    flex: 1,
    paddingLeft: Size[3],
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[12],
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: {
    flex: 1,
  },
});

const TrackItem: FC<TrackItemProps> = ({
  track,
  isPlaying,
  fetching,
  hideImage,
}) => {
  const durationStr = useMemo(() => {
    if (!track) return "";
    const [sec, min] = msToHMS(track.duration, true);
    return `${min}:${sec}`;
  }, [track]);

  return (
    <View style={styles.root}>
      {hideImage ? null : (
        <View style={styles.image}>
          {fetching ? (
            <SkeletonBlock style={StyleSheet.absoluteFill} />
          ) : (
            <Image
              style={StyleSheet.absoluteFill}
              source={track?.image ? { uri: track?.image } : imageDefaultTrack}
              defaultSource={imageDefaultTrack}
              accessibilityLabel={track?.title}
            />
          )}
          {isPlaying && (
            <View style={styles.isPlaying}>
              <Image source={imageIconPlaying} style={styles.isPlayingIcon} />
            </View>
          )}
        </View>
      )}
      <View style={styles.meta}>
        {fetching ? (
          <SkeletonBlock width={36} height={4} />
        ) : (
          <View style={styles.title}>
            {track && (
              <IconByPlatformName
                platformName={track.platform}
                width={Size[4]}
                height={Size[4]}
              />
            )}
            <Spacer x={1} />
            <Text numberOfLines={1} bold style={styles.titleText}>
              {track?.title}
            </Text>
          </View>
        )}
        <Spacer y={2} />
        {fetching ? (
          <SkeletonBlock width={32} height={4} />
        ) : (
          <Text color="textSecondary" size="sm" numberOfLines={1}>
            {durationStr}
            {" • "}
            {track?.artists.map(({ name }) => name).join(", ")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default TrackItem;
