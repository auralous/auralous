import { imageSources, SvgByPlatformName } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
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
});

const PlaylistListItem: FC<PlaylistListItemProps> = ({ playlist }) => {
  const SvgPlatformIcon = SvgByPlatformName[playlist.platform];

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
          <SvgPlatformIcon
            width={Size[4]}
            height={Size[4]}
            fill={Colors.text}
          />
          <Spacer x={1} />
          <Text bold numberOfLines={1}>
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
