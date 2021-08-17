import { RouteName } from "@/screens/types";
import { useTrackQuery } from "@auralous/api";
import player, {
  usePlaybackColor,
  usePlaybackCurrentControl,
  usePlaybackTrackId,
} from "@auralous/player";
import {
  Colors,
  IconByPlatformName,
  IconPause,
  IconPlay,
  Size,
  SkeletonBlock,
  Spacer,
  TextMarquee,
} from "@auralous/ui";
import { ImageSources } from "@auralous/ui/src/assets/images";
import { useNavigationState } from "@react-navigation/native";
import { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAnimatedBgColors } from "./useAnimatedBgColors";

const styles = StyleSheet.create({
  bg: { opacity: 0.5 },
  button: {
    alignItems: "center",
    height: Size[16],
    justifyContent: "center",
    width: Size[16],
  },
  image: {
    height: Size[16],
    resizeMode: "cover",
    width: Size[16],
  },
  meta: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flexDirection: "row",
    height: Size[16],
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
  RouteName.SignIn,
  RouteName.Map,
] as string[];

const PlayerBar: FC<{ visible: boolean; onPress(): void }> = ({
  visible,
  onPress,
}) => {
  const { t } = useTranslation();

  const { isPlaying } = usePlaybackCurrentControl();
  const trackId = usePlaybackTrackId();
  const playbackCurrentContext = usePlaybackCurrentControl();

  const [{ data, fetching }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  const track = trackId ? data?.track : null;

  const togglePlay = useCallback(
    () => (isPlaying ? player.pause() : player.play()),
    [isPlaying]
  );

  const animatedBgStyle = useAnimatedBgColors(usePlaybackColor());

  const translateYValue = useSharedValue(0);

  useEffect(() => {
    if (visible) translateYValue.value = withTiming(0);
    else translateYValue.value = withTiming(Size[16]);
  }, [visible, translateYValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateYValue.value,
      },
    ],
  }));

  const onPressWithAnimate = useCallback(() => {
    translateYValue.value = withTiming(Size[16]);
    onPress();
  }, [onPress, translateYValue]);

  if (!playbackCurrentContext) return null;

  if (hiddenRoutes.includes(navigationRouteName)) return null;

  return (
    <Animated.View style={[styles.root, animatedStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.bg, StyleSheet.absoluteFill, animatedBgStyle]}
      />
      <Pressable style={styles.viewExpandTrigger} onPress={onPressWithAnimate}>
        <Image
          style={styles.image}
          source={
            track?.image ? { uri: track?.image } : ImageSources.defaultTrack
          }
          defaultSource={ImageSources.defaultTrack}
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
