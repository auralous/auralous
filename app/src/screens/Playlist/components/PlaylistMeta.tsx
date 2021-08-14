import { RouteName } from "@/screens/types";
import { Playlist } from "@auralous/api";
import player from "@auralous/player";
import { Button, Heading, Size, Spacer, Text } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[1],
  },
  image: {
    height: Size[40],
    marginBottom: 10,
    width: Size[40],
  },
  meta: {
    paddingVertical: Size[2],
    width: "100%",
  },
  root: {
    alignItems: "center",
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

const PlaylistMeta: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const { t } = useTranslation();

  const shufflePlay = useCallback(
    () =>
      player.playContext({
        id: playlist.id,
        type: "playlist",
        shuffle: true,
      }),
    [playlist]
  );

  const navigation = useNavigation();

  const quickPlay = useCallback(() => {
    navigation.navigate(RouteName.NewQuickShare, { playlist });
  }, [playlist, navigation]);

  return (
    <>
      <View style={styles.root}>
        <Image
          source={
            playlist.image
              ? { uri: playlist.image }
              : require("@/assets/images/default_playlist.jpg")
          }
          defaultSource={require("@/assets/images/default_playlist.jpg")}
          style={styles.image}
          accessibilityLabel={playlist.name}
        />
        <View style={styles.meta}>
          <View style={{ height: Size[4] }}>
            <Text align="center" color="textTertiary" size="sm">
              {t("playlist.title")} •{" "}
              {t("playlist.x_song", { count: playlist.total })}
            </Text>
          </View>
          <Spacer y={2} />
          <Heading level={4} align="center">
            {playlist.name}
          </Heading>
          <Spacer y={3} />
          <Text color="textSecondary" align="center">
            {playlist.creatorName}
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
        <Spacer x={2} />
        <Button onPress={quickPlay} variant="primary">
          {t("new.quick_share.title")}
        </Button>
      </View>
    </>
  );
};

export default PlaylistMeta;
