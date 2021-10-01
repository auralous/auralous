import { ImageSources } from "@/assets";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import player from "@/player";
import { styles } from "@/screens/_commonContent";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";

const PlaylistMeta: FC<{
  playlist: Playlist;
  onQuickShare(playlist: Playlist): void;
}> = ({ playlist, onQuickShare }) => {
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

  const quickShare = useCallback(() => {
    onQuickShare(playlist);
  }, [playlist, onQuickShare]);

  return (
    <View style={styles.root}>
      <Image
        source={
          playlist.image
            ? { uri: playlist.image }
            : ImageSources.defaultPlaylist
        }
        defaultSource={ImageSources.defaultPlaylist}
        style={styles.image}
        accessibilityLabel={playlist.name}
      />
      <View style={styles.meta}>
        <View style={styles.tag}>
          <Text align="center" color="textTertiary" size="sm">
            {t("playlist.title")} •{" "}
            {t("playlist.x_song", { count: playlist.total })}
          </Text>
        </View>
        <Heading level={4} align="center" numberOfLines={1}>
          {playlist.name}
        </Heading>
        <Spacer y={3} />
        <Text color="textSecondary" align="center" numberOfLines={1}>
          {playlist.creatorName}
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
        <Spacer x={2} />
        <Button onPress={quickShare} variant="primary">
          {t("new.quick_share.title")}
        </Button>
      </View>
    </View>
  );
};

export default PlaylistMeta;
