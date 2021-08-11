import { RouteName } from "@/screens/types";
import { useTrackQuery } from "@auralous/api";
import player, {
  usePlaybackColor,
  usePlaybackCurrentControl,
  usePlaybackTrackId,
} from "@auralous/player";
import {
  IconPause,
  IconPlay,
  makeStyles,
  Size,
  Text,
  useColors,
} from "@auralous/ui";
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

const useStyles = makeStyles((theme) => ({
  root: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    flexDirection: "row",
    height: Size[16],
    backgroundColor: theme.colors.backgroundSecondary,
  },
}));

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
] as string[];

const PlayerBar: FC<{ visible: boolean; onPress(): void }> = ({
  visible,
  onPress,
}) => {
  const { t } = useTranslation();

  const { isPlaying } = usePlaybackCurrentControl();
  const trackId = usePlaybackTrackId();
  const playbackCurrentContext = usePlaybackCurrentControl();

  const [{ data }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  const track = trackId ? data?.track : null;

  const colors = useColors();

  const togglePlay = useCallback(
    () => (isPlaying ? player.pause() : player.play()),
    [isPlaying]
  );

  const dstyles = useStyles();

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
    <Animated.View style={[dstyles.root, animatedStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.bg, StyleSheet.absoluteFill, animatedBgStyle]}
      />
      <Pressable style={styles.viewExpandTrigger} onPress={onPressWithAnimate}>
        <Image
          style={styles.image}
          source={
            track?.image
              ? { uri: track?.image }
              : require("@/assets/images/default_track.jpg")
          }
          defaultSource={require("@/assets/images/default_track.jpg")}
          accessibilityLabel={track?.title}
        />
        <View style={styles.meta}>
          <Text bold size="sm" numberOfLines={1}>
            {track?.title}
          </Text>
          <Text color="textSecondary" size="sm" numberOfLines={1}>
            {track?.artists.map((artist) => artist.name).join(", ")}
          </Text>
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
            <IconPause fill={colors.text} />
          ) : (
            <IconPlay fill={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default PlayerBar;
