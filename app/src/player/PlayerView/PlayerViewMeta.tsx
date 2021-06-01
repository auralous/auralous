import { Text } from "@/components/Typography";
import { Maybe, Track } from "@/gql/gql.gen";
import { Size } from "@/styles";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  header: {
    padding: Size[2],
  },
});

const PlayerViewMeta: React.FC<{ track: Maybe<Track> }> = ({ track }) => {
  return (
    <>
      <ImageBackground
        style={styles.image}
        resizeMode="contain"
        source={{ uri: track?.image }}
      />
      <View style={styles.header}>
        <Text size="xl" bold numberOfLines={1}>
          {track?.title}
        </Text>
        <Text size="lg" color="textSecondary" numberOfLines={1}>
          {track?.artists.map((artist) => artist.name).join(", ")}
        </Text>
      </View>
    </>
  );
};

export default PlayerViewMeta;
