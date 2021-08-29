import { useTrackQuery } from "@auralous/api";
import type { PlaybackState } from "@auralous/player";
import { IconChevronUp, Size, Spacer, Text } from "@auralous/ui";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  button: {
    padding: Size[2],
  },
  meta: {
    flex: 1,
    height: Size[10],
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Size[2],
  },
});

const MetaAndButton: FC<{
  nextItems: PlaybackState["nextItems"];
  onPress(): void;
}> = ({ nextItems, onPress }) => {
  const { t } = useTranslation();
  const nextTrackId = nextItems[0]?.trackId || undefined;

  const [{ data: dataNextTrack }] = useTrackQuery({
    variables: {
      id: nextTrackId || "",
    },
    pause: !nextTrackId,
  });

  const nextTrack = nextTrackId ? dataNextTrack?.track : null;

  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <View style={styles.meta}>
        <Text color="textSecondary" size="sm" bold>
          {t("queue.up_next")}
        </Text>
        <Spacer y={2} />
        <Text color="text" size="sm" bold numberOfLines={1}>
          {nextTrack &&
            `${nextTrack.artists.map((a) => a.name).join(", ")} - ${
              nextTrack.title
            }`}
        </Text>
      </View>
      <View style={styles.button}>
        <IconChevronUp color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
};

export default MetaAndButton;
