import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Maybe, Track } from "@/gql/gql.gen";
import { Size } from "@/styles";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Size[2],
  },
  image: {
    width: Size[12],
    height: Size[12],
    borderRadius: 4,
  },
  header: {
    flex: 1,
  },
});

const PlayerViewTopbar: React.FC<{ track: Maybe<Track> | undefined }> = ({
  track,
}) => {
  return (
    <View style={styles.root}>
      <Image style={styles.image} source={{ uri: track?.image }} />
      <Spacer x={4} />
      <View style={styles.header}>
        <Text color="textSecondary" size="lg" numberOfLines={1}>
          {track?.artists.map((artist) => artist.name).join(", ")}
        </Text>
        <Text bold size="xl" numberOfLines={1}>
          {track?.title}
        </Text>
      </View>
    </View>
  );
};

export default PlayerViewTopbar;
