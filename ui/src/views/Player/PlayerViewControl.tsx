import { IconPause, IconPlay, IconSkipBack, IconSkipForward } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Colors, Size } from "@/styles";
import type { Player } from "@auralous/player";
import { PlaybackState } from "@auralous/player";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  backPrev: {
    alignItems: "center",
    height: Size[10],
    justifyContent: "center",
    width: Size[10],
  },
  playPause: {
    alignItems: "center",
    backgroundColor: Colors.textTertiary,
    borderRadius: 9999,
    height: Size[16],
    justifyContent: "center",
    width: Size[16],
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: Size[1],
    paddingVertical: Size[2],
  },
});

const PlayerViewControl: FC<{
  control: Pick<PlaybackState, "isPlaying">;
  trackId: string | null;
  player: Player;
}> = ({ trackId, control, player }) => {
  const { t } = useTranslation();

  const onSkipBackward = useCallback(() => player.skipBackward(), [player]);
  const onSkipForward = useCallback(() => player.skipForward(), [player]);
  const togglePlay = useCallback(
    () => (control.isPlaying ? player.pause() : player.play()),
    [player, control.isPlaying]
  );

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.backPrev}
        onPress={onSkipBackward}
        accessibilityLabel={t("player.skip_backward")}
      >
        <IconSkipBack width={Size[8]} height={Size[8]} fill={Colors.text} />
      </TouchableOpacity>
      <Spacer x={8} />
      <View style={trackId ? undefined : { opacity: 0.5 }}>
        <TouchableOpacity
          onPress={togglePlay}
          style={styles.playPause}
          accessibilityLabel={
            control.isPlaying ? t("player.pause") : t("player.play")
          }
          disabled={!trackId}
        >
          {control.isPlaying ? (
            <IconPause width={Size[10]} height={Size[10]} fill={Colors.text} />
          ) : (
            <IconPlay width={Size[10]} height={Size[10]} fill={Colors.text} />
          )}
        </TouchableOpacity>
      </View>
      <Spacer x={8} />
      <TouchableOpacity
        style={styles.backPrev}
        onPress={onSkipForward}
        accessibilityLabel={t("player.skip_forward")}
      >
        <IconSkipForward width={Size[8]} height={Size[8]} fill={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerViewControl;
