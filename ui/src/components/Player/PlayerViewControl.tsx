import type { Player } from "@auralous/player";
import { PlaybackState } from "@auralous/player";
import {
  IconPause,
  IconPlay,
  IconSkipBack,
  IconSkipForward,
} from "@auralous/ui/assets";
import { Spacer } from "@auralous/ui/components/Spacer";
import { Size, useColors } from "@auralous/ui/styles";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    paddingVertical: Size[2],
    paddingHorizontal: Size[1],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backPrev: {
    width: Size[10],
    height: Size[10],
    justifyContent: "center",
    alignItems: "center",
  },
  playPause: {
    width: Size[16],
    height: Size[16],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
});

const PlayerViewControl: FC<{
  playbackState: PlaybackState;
  player: Player;
}> = ({
  playbackState: { canSkipBackward, canSkipForward, isPlaying, trackId },
  player,
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
      <Spacer x={8} />
      <View style={trackId ? undefined : { opacity: 0.5 }}>
        <TouchableOpacity
          onPress={() => (isPlaying ? player.pause() : player.play())}
          style={[styles.playPause, { backgroundColor: colors.textTertiary }]}
          accessibilityLabel={isPlaying ? t("player.pause") : t("player.play")}
          disabled={!trackId}
        >
          {isPlaying ? (
            <IconPause width={Size[10]} height={Size[10]} fill={colors.text} />
          ) : (
            <IconPlay width={Size[10]} height={Size[10]} fill={colors.text} />
          )}
        </TouchableOpacity>
      </View>
      <Spacer x={8} />
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
