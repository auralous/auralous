import { IconByPlatformName, ImageSources } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import { Playlist } from "@auralous/api";
import { FC, memo } from "react";
import { Image, StyleSheet, View } from "react-native";

interface PlaylistListItemProps {
  playlist: Playlist;
}

const styles = StyleSheet.create({
  image: {
    height: Size[12],
    width: Size[12],
  },
  meta: {
    flex: 1,
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: { flex: 1 },
});

const PlaylistListItem: FC<PlaylistListItemProps> = ({ playlist }) => {
  return (
    <View style={styles.root}>
      <Image
        style={styles.image}
        source={
          playlist?.image
            ? { uri: playlist?.image }
            : ImageSources.defaultPlaylist
        }
        defaultSource={ImageSources.defaultPlaylist}
        accessibilityLabel={playlist?.name}
      />
      <Spacer x={2} />
      <View style={styles.meta}>
        <View style={styles.title}>
          <IconByPlatformName
            platformName={playlist.platform}
            width={Size[4]}
            height={Size[4]}
          />
          <Spacer x={1} />
          <Text style={styles.titleText} bold numberOfLines={1}>
            {playlist.name}
          </Text>
        </View>
        <Spacer y={2} />
        <Text color="textSecondary" size="sm" numberOfLines={1}>
          {playlist.creatorName}
        </Text>
      </View>
    </View>
  );
};

export default memo(PlaylistListItem);
