import {
  IconPause,
  IconPlay,
  IconSkipBack,
  IconSkipForward,
} from "@/assets/svg";
import { Spacer } from "@/components/Spacer";
import { Size, useColors } from "@/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { PlaybackState } from "../Context";
import Player from "../Player";

const styles = StyleSheet.create({
  root: {
    paddingVertical: Size[2],
    paddingHorizontal: Size[1],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backPrev: {
    justifyContent: "center",
    alignItems: "center",
    padding: Size[3],
  },
  playPause: {
    padding: Size[4],
    borderRadius: 9999,
  },
});

const PlayerViewControl: React.FC<{
  player: Player;
  playbackState: PlaybackState;
}> = ({
  player,
  playbackState: { canSkipBackward, canSkipForward, isPlaying, trackId },
}) => {
  const { t } = useTranslation();

  const colors = useColors();

  return (
    <View style={styles.root}>
      <View style={canSkipBackward ? undefined : { opacity: 0.5 }}>
        <TouchableOpacity
          style={styles.backPrev}
          disabled={!canSkipBackward}
          onPress={() => player.skipBackward()}
          accessibilityLabel={t("player.skip_backward")}
        >
          <IconSkipBack
            width={Size[8]}
            height={Size[8]}
            fill={colors.text}
            stroke={colors.text}
          />
        </TouchableOpacity>
      </View>
      <Spacer x={4} />
      <View style={trackId ? undefined : { opacity: 0.5 }}>
        <TouchableOpacity
          onPress={() => (isPlaying ? player.pause() : player.play())}
          style={[styles.playPause, { backgroundColor: colors.control }]}
          accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
          disabled={!trackId}
        >
          {isPlaying ? (
            <IconPause
              width={Size[8]}
              height={Size[8]}
              fill={colors.controlText}
            />
          ) : (
            <IconPlay
              width={Size[8]}
              height={Size[8]}
              fill={colors.controlText}
            />
          )}
        </TouchableOpacity>
      </View>
      <Spacer x={4} />
      <View style={canSkipForward ? undefined : { opacity: 0.5 }}>
        <TouchableOpacity
          style={styles.backPrev}
          disabled={!canSkipForward}
          onPress={() => player.skipForward()}
          accessibilityLabel={t("player.skip_forward")}
        >
          <IconSkipForward
            width={Size[8]}
            height={Size[8]}
            fill={colors.text}
            stroke={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerViewControl;
