import { IconByPlatformName, IconPause, IconPlay } from "@/assets";
import imageDefaultTrack from "@/assets/images/default_track.jpg";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { TextMarquee } from "@/components/Typography";
import player, {
  usePlaybackColor,
  usePlaybackCurrentControl,
  usePlaybackTrackId,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { useAnimatedBgColors } from "@/styles/utils";
import { useTrackQuery } from "@auralous/api";
import { useNavigationState } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
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
  useSharedValue,
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
    backgroundColor: Colors.backgroundSecondary,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: PLAYER_BAR_HEIGHT,
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
  RouteName.Home,
  RouteName.NewFinal,
  RouteName.NewQuickShare,
  RouteName.NewSelectSongs,
  RouteName.Map,
] as string[];

const PlayerBar: FC<{ onPress(): void }> = ({ onPress }) => {
  const { t } = useTranslation();

  const { isPlaying } = usePlaybackCurrentControl();
  const trackId = usePlaybackTrackId();

  const [{ data, fetching }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const track = trackId ? data?.track : null;

  const togglePlay = useCallback(
    () => (isPlaying ? player.pause() : player.play()),
    [isPlaying]
  );

  const animatedBgStyle = useAnimatedBgColors(usePlaybackColor());

  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  const hidden =
    !navigationRouteName || hiddenRoutes.includes(navigationRouteName);

  const animValue = useSharedValue(0);

  useEffect(() => {
    if (hidden) animValue.value = withTiming(0);
    else animValue.value = withTiming(1);
  }, [hidden, animValue]);

  const windowWidth = useWindowDimensions().width;
  const baseBottom = windowWidth >= LayoutSize.md ? 0 : Size[14];
  const animRootStyle = useAnimatedStyle(() => {
    return {
      bottom: baseBottom - (1 - animValue.value) * 2 * Size[14],
    };
  }, [baseBottom]);

  return (
    <Animated.View style={[styles.root, animRootStyle]}>
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
              <TextMarquee color="textSecondary" size="sm" duration={15000}>
                {track?.artists.map((artist) => artist.name).join(", ")}
              </TextMarquee>
            )}
          </View>
        </View>
      </Pressable>
      <View>
        <TouchableOpacity
          onPress={togglePlay}
          style={styles.button}
          accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
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
  );
};

export default PlayerBar;
