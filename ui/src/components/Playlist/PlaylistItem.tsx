import { imageSources } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import { Playlist } from "@auralous/api";
import { FC, memo } from "react";
import { Image, StyleSheet, View } from "react-native";

interface PlaylistItemProps {
  playlist: Playlist;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: Size[2],
    height: Size[32],
    marginBottom: Size[1],
    resizeMode: "cover",
    width: Size[32],
  },
  meta: {
    paddingHorizontal: Size[1],
    paddingVertical: Size[1],
  },
  metaTitle: {
    lineHeight: 16,
  },
  root: {
    width: Size[32],
  },
});

const PlaylistItem: FC<PlaylistItemProps> = ({ playlist }) => {
  return (
    <View style={styles.root}>
      <Image
        source={
          playlist.image
            ? { uri: playlist.image }
            : imageSources.defaultPlaylist
        }
        defaultSource={imageSources.defaultPlaylist}
        style={styles.image}
        accessibilityLabel={playlist.name}
      />
      <View style={styles.meta}>
        <Text style={styles.metaTitle} bold="medium" numberOfLines={1}>
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
