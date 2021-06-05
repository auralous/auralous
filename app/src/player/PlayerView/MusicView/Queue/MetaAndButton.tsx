import { IconChevronUp } from "@/assets/svg";
import { Text } from "@/components/Typography";
import { useTrackQuery } from "@/gql/gql.gen";
import { PlaybackState } from "@/player/Context";
import { Size } from "@/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    padding: Size[2],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    flex: 1,
    height: Size[10],
  },
  button: {
    padding: Size[2],
  },
});

const MetaAndButton: React.FC<{
  playbackState: PlaybackState;
  onPress(): void;
}> = ({ playbackState, onPress }) => {
  const { t } = useTranslation();
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: {
      id: playbackState.trackId || "",
    },
    pause: !playbackState.trackId,
  });

  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <View style={styles.meta}>
        <Text color="textSecondary" size="sm" bold>
          {t("queue.up_next")}
        </Text>
        <Text color="text" size="sm" bold numberOfLines={1}>
          {!!track &&
            `${track.artists.map((a) => a.name).join(", ")} - ${track.title}`}
        </Text>
      </View>
      <View style={styles.button}>
        <IconChevronUp color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
};

export default MetaAndButton;
