import { Text } from "components/Typography";
import { Maybe, Playlist } from "gql/gql.gen";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Size } from "styles";
import { useTranslation } from "utils/i18n";

interface PlaylistItemProps {
  playlist: Maybe<Playlist>;
  loading?: boolean;
}

const styles = StyleSheet.create({
  image: {
    width: Size[32],
    height: Size[32],
    borderRadius: Size[2],
    resizeMode: "cover",
    marginBottom: Size[1],
  },
  meta: {
    paddingVertical: Size[1],
    paddingHorizontal: Size[1],
  },
  metaTitle: {
    lineHeight: 16,
  },
});

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist }) => {
  const { t } = useTranslation();

  return (
    <View>
      <Image source={{ uri: playlist?.image }} style={styles.image} />
      <View style={styles.meta}>
        <Text style={styles.metaTitle} bold="medium">
          {playlist?.name}
        </Text>
        <Text size="sm" color="textTertiary">
          {t(`music_platform.${playlist?.platform}.name`)}
        </Text>
      </View>
    </View>
  );
};

export default PlaylistItem;
