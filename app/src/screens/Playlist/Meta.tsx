import { Playlist } from "@auralous/api";
import player, { PlaybackContextType } from "@auralous/player";
import { Button, Heading, Size, Spacer, Text } from "@auralous/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    paddingVertical: Size[3],
    paddingHorizontal: Size[6],
    alignItems: "center",
  },
  meta: {
    width: "100%",
  },
  image: {
    width: Size[40],
    height: Size[40],
    marginBottom: 10,
  },
  buttons: {
    padding: Size[1],
    flexDirection: "row",
    justifyContent: "center",
  },
});

const Meta: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const { t } = useTranslation();
  const shufflePlay = useCallback(
    () =>
      player.playContext({
        id: playlist.id,
        type: PlaybackContextType.Playlist,
      }),
    [playlist]
  );
  return (
    <>
      <View style={styles.root}>
        <Image
          source={
            playlist.image
              ? { uri: playlist.image }
              : require("@auralous/ui/assets/images/default_playlist.jpg")
          }
          defaultSource={require("@auralous/ui/assets/images/default_playlist.jpg")}
          style={styles.image}
        />
        <View style={styles.meta}>
          <View style={{ height: Size[6] }}>
            <Text align="center" color="textTertiary" size="sm">
              {t("playlist.title")} •{" "}
              {t("playlist.x_song", { count: playlist.total })}
            </Text>
          </View>
          <Heading level={4} align="center">
            {playlist.name}
          </Heading>
          <Text color="textSecondary" align="center">
            Some author
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
        <Spacer x={2} />
        <Button variant="primary">{t("new.quick_share.title")}</Button>
      </View>
    </>
  );
};

export default Meta;
