import { IconPause, IconPlay } from "@/assets/svg";
import { Text } from "@/components/Typography";
import { useTrackQuery } from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { usePlaybackState, usePlayer } from "./Context";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    height: Size[16],
  },
  viewExpandTrigger: {
    flexDirection: "row",
    flex: 1,
  },
  image: {
    width: Size[16],
    height: Size[16],
    resizeMode: "cover",
  },
  meta: {
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
    justifyContent: "center",
    flex: 1,
  },
  button: {
    width: Size[16],
    height: Size[16],
    justifyContent: "center",
    alignItems: "center",
  },
});

const PlayerBar: React.FC = () => {
  const { t } = useTranslation();

  const {
    trackId,
    playbackCurrentContext,
    isPlaying,
    colors: gradientColors,
  } = usePlaybackState();
  const player = usePlayer();
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  const colors = useColors();

  if (!playbackCurrentContext) return null;
  return (
    <View style={[styles.root, { backgroundColor: gradientColors[1] }]}>
      <Pressable
        style={styles.viewExpandTrigger}
        onPress={() => player.emit("__player_bar_pressed")}
      >
        <Image style={styles.image} source={{ uri: track?.image }} />
        <View style={styles.meta}>
          <Text bold size="sm" numberOfLines={1}>
            {track?.title}
          </Text>
          <Text color="textSecondary" size="sm" numberOfLines={1}>
            {track?.artists.map((artist) => artist.name).join(", ")}
          </Text>
        </View>
      </Pressable>
      <View style={trackId ? undefined : { opacity: 0.5 }}>
        <TouchableOpacity
          onPress={() => (isPlaying ? player.pause() : player.play())}
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
    </View>
  );
};

export default PlayerBar;
