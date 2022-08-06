import { IconByPlatformName, IconPause, IconPlay } from "@/assets";
import imageDefaultTrack from "@/assets/images/default_track.jpg";
import { Image } from "@/components/Image";
import { BOTTOM_TABS_HEIGHT } from "@/components/Layout/BottomTabs";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Text, TextMarquee } from "@/components/Typography";
import player from "@/player";
import {
  usePlaybackStateControlContext,
  usePlaybackStateSourceContext,
  usePlaybackStateStatusContext,
} from "@/player/Context";
import { useIsFullscreenRoute } from "@/screens/useRouteName";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export const PLAYER_BAR_HEIGHT = Size[14];

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    height: PLAYER_BAR_HEIGHT,
    justifyContent: "center",
    width: PLAYER_BAR_HEIGHT,
  },
  content: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: PLAYER_BAR_HEIGHT,
    paddingHorizontal: Size[2],
    width: "100%",
  },
  image: {
    borderRadius: 4,
    height: "100%",
    resizeMode: "cover",
    width: "100%",
  },
  imageWrap: {
    height: PLAYER_BAR_HEIGHT,
    padding: Size[1.5],
    resizeMode: "cover",
    width: PLAYER_BAR_HEIGHT,
  },
  meta: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  root: {
    bottom: BOTTOM_TABS_HEIGHT,
    overflow: "hidden",
    position: "absolute",
    width: "100%",
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  titleText: {
    flex: 1,
  },
  viewExpandTrigger: {
    flexDirection: "row",
    flex: 1,
  },
});

const PlayerBar: FC<{ onPress(): void }> = ({ onPress }) => {
  const { t } = useTranslation();

  const { isPlaying } = usePlaybackStateControlContext();
  const trackId = usePlaybackStateSourceContext().trackId;

  const [{ data, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const track = trackId ? data?.track : null;

  const togglePlay = useCallback(
    () => (isPlaying ? player.pause() : player.play()),
    [isPlaying]
  );

  const hidden = useIsFullscreenRoute();

  const windowWidth = useWindowDimensions().width;
  const isLandscape = windowWidth >= LayoutSize.md;

  const animRootStyle = useAnimatedStyle(() => {
    if (isLandscape) return { bottom: 0 };
    return { bottom: BOTTOM_TABS_HEIGHT };
  }, [isLandscape]);

  const { error: playbackError, fetching: playbackFetching } =
    usePlaybackStateStatusContext();

  const fetching = fetchingTrack || playbackFetching;

  if (hidden) return null;

  return (
    <Animated.View style={[styles.root, animRootStyle]}>
      <Animated.View style={styles.content}>
        {/* <Animated.View
          pointerEvents="none"
          style={[styles.bg, StyleSheet.absoluteFill, animatedBgStyle]}
        /> */}
        <Pressable style={styles.viewExpandTrigger} onPress={onPress}>
          <View style={styles.imageWrap}>
            <Image
              style={styles.image}
              source={track?.image ? { uri: track?.image } : imageDefaultTrack}
              defaultSource={imageDefaultTrack}
              accessibilityLabel={track?.title}
            />
          </View>
          <View style={styles.meta}>
            {playbackError ? (
              <>
                <Text italic numberOfLines={1}>
                  {t("player.error.unplayable")}
                </Text>
                <Spacer y={2} />
                <Text italic color="textSecondary" size="sm" numberOfLines={1}>
                  {t(`player.error.${playbackError}`)}
                </Text>
              </>
            ) : (
              <>
                {fetching ? (
                  <SkeletonBlock width={27} height={2} />
                ) : (
                  <View style={styles.title}>
                    {track?.platform && (
                      <IconByPlatformName
                        platformName={track.platform}
                        width={Size[3]}
                        height={Size[3]}
                        noColor
                      />
                    )}
                    <Spacer x={1} />
                    <TextMarquee
                      containerStyle={styles.titleText}
                      bold
                      size="sm"
                      duration={15000}
                    >
                      {track?.title}
                    </TextMarquee>
                  </View>
                )}
                <Spacer y={2} />
                <View>
                  {fetching ? (
                    <SkeletonBlock width={24} height={2} />
                  ) : (
                    <TextMarquee
                      color="textSecondary"
                      size="sm"
                      duration={15000}
                    >
                      {track?.artists.map((artist) => artist.name).join(", ")}
                    </TextMarquee>
                  )}
                </View>
              </>
            )}
          </View>
        </Pressable>
        <View>
          <TouchableOpacity
            onPress={togglePlay}
            style={styles.button}
            accessibilityLabel={
              isPlaying ? t("player.pause") : t("player.play")
            }
            disabled={!trackId}
          >
            {isPlaying ? (
              <IconPause fill={Colors.text} />
            ) : (
              <IconPlay fill={Colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default PlayerBar;
