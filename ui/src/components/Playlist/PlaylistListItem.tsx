import { imageSources } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import { Maybe, Playlist } from "@auralous/api";
import { FC, memo } from "react";
import { Image, StyleSheet, View } from "react-native";

interface PlaylistListItemProps {
  playlist: Maybe<Playlist>;
  fetching?: boolean;
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
});

const PlaylistListItem: FC<PlaylistListItemProps> = ({ playlist }) => {
  return (
    <View style={styles.root}>
      <Image
        style={styles.image}
        source={
          playlist?.image
            ? { uri: playlist?.image }
            : imageSources.defaultPlaylist
        }
        defaultSource={imageSources.defaultPlaylist}
        accessibilityLabel={playlist?.name}
      />
      <Spacer x={2} />
      <View style={styles.meta}>
        <View style={styles.title}>
          <Spacer x={1} />
          <Text bold numberOfLines={1}>
            {playlist?.name}
          </Text>
        </View>
        <Text color="textSecondary" size="sm" numberOfLines={1}>
          {playlist?.creatorName}
        </Text>
      </View>
    </View>
  );
};

export default memo(PlaylistListItem);
