import { Spacer } from "components/Spacer";
import { Text } from "components/Typography";
import { Maybe, Playlist } from "gql/gql.gen";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { Size } from "styles";

interface PlaylistListItemProps {
  playlist: Maybe<Playlist>;
  loading?: boolean;
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: Size[12],
    height: Size[12],
  },
  meta: {
    flex: 1,
  },
});

const PlaylistListItem: React.FC<PlaylistListItemProps> = ({ playlist }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Image style={styles.image} source={{ uri: playlist?.image }} />
      <Spacer x={2} />
      <View style={styles.meta}>
        <View style={styles.title}>
          <Spacer x={1} />
          <Text bold numberOfLines={1}>
            {playlist?.name}
          </Text>
        </View>
        <Text color="textSecondary" size="sm" numberOfLines={1}>
          {t(`music_platform.${playlist?.platform}.name` as const)}
        </Text>
      </View>
    </View>
  );
};

export default PlaylistListItem;
