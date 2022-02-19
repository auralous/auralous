import { IconByPlatformName, IconPause, IconPlay } from "@/assets";
import imageDefaultTrack from "@/assets/images/default_track.jpg";
import { BOTTOM_TABS_HEIGHT } from "@/components/Layout/BottomTabs";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Text, TextMarquee } from "@/components/Typography";
import player, {
  usePlaybackColor,
  usePlaybackCurrentControl,
  usePlaybackPlayingTrackId,
  usePlaybackStatus,
} from "@/player";
import { RouteName } from "@/screens/types";
import { useIsRouteWithNavbar, useRouteNames } from "@/screens/useRouteName";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { useAnimatedBgColors } from "@/styles/utils";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export const PLAYER_BAR_HEIGHT = Size[14];

const styles = StyleSheet.create({
  bg: { opacity: 0.5 },
  button: {
    alignItems: "center",
    height: PLAYER_BAR_HEIGHT,
    justifyContent: "center",
    width: PLAYER_BAR_HEIGHT,
  },
  content: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: PLAYER_BAR_HEIGHT,
    width: "100%",
  },
  image: {
    height: PLAYER_BAR_HEIGHT,
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

const hiddenRoutes = [
  RouteName.NewFinal,
  RouteName.NewQuickShare,
  RouteName.NewSelectSongs,
  RouteName.Map,
] as string[];

const PlayerBar: FC<{ onPress(): void }> = ({ onPress }) => {
  const { t } = useTranslation();

  const { isPlaying } = usePlaybackCurrentControl();
  const trackId = usePlaybackPlayingTrackId();

  const [{ data, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const track = trackId ? data?.track : null;

  const togglePlay = useCallback(
    () => (isPlaying ? player.pause() : player.play()),
    [isPlaying]
  );

  const animatedBgStyle = useAnimatedBgColors(usePlaybackColor());

  const routeNames = useRouteNames();
  const routeName = routeNames[routeNames.length - 1];
  const hasTabBars = useIsRouteWithNavbar();

  const hidden = hiddenRoutes.includes(routeName);

  const windowWidth = useWindowDimensions().width;
  const isLandscape = windowWidth >= LayoutSize.md;

  const animContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming((hidden ? 1 : 0) * PLAYER_BAR_HEIGHT) },
      ],
    };
  }, [hidden]);
  const animRootStyle = useAnimatedStyle(() => {
    if (!hasTabBars || isLandscape) return { bottom: withTiming(0) };
    return { bottom: withTiming(BOTTOM_TABS_HEIGHT) };
  }, [hasTabBars, isLandscape]);

  const { error: playbackError, fetching: playbackFetching } =
    usePlaybackStatus();

  const fetching = fetchingTrack || playbackFetching;

  return (
    <Animated.View
      pointerEvents={hidden ? "none" : "auto"}
      style={[styles.root, animRootStyle]}
    >
      <Animated.View style={[styles.content, animContentStyle]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.bg, StyleSheet.absoluteFill, animatedBgStyle]}
        />
        <Pressable style={styles.viewExpandTrigger} onPress={onPress}>
          <Image
            style={styles.image}
            source={track?.image ? { uri: track?.image } : imageDefaultTrack}
            defaultSource={imageDefaultTrack}
            accessibilityLabel={track?.title}
          />
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
