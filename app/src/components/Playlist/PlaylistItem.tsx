import { ImageSources } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";

interface PlaylistItemProps {
  playlist: Playlist;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: Size[2],
    marginBottom: Size[1],
    overflow: "hidden",
    paddingBottom: "100%",
    position: "relative",
    resizeMode: "cover",
    width: "100%",
  },
  meta: {
    paddingHorizontal: Size[1],
    paddingVertical: Size[1],
  },
  root: {
    width: "100%",
  },
});

const PlaylistItem: FC<PlaylistItemProps> = ({ playlist }) => {
  return (
    <View style={styles.root}>
      <View style={styles.image}>
        <Image
          source={
            playlist.image
              ? { uri: playlist.image }
              : ImageSources.defaultPlaylist
          }
          defaultSource={ImageSources.defaultPlaylist}
          style={StyleSheet.absoluteFill}
          accessibilityLabel={playlist.name}
        />
      </View>
      <View style={styles.meta}>
        <Text bold="medium" numberOfLines={1}>
          {playlist.name}
        </Text>
        <Spacer y={2} />
        <Text size="sm" color="textTertiary">
          {playlist.creatorName}
        </Text>
      </View>
    </View>
  );
};

export default memo(PlaylistItem);
