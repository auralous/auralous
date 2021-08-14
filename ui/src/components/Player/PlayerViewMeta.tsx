import { imageSources } from "@/assets";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import { Maybe, Track } from "@auralous/api";
import { FC } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SkeletonBlock } from "../Loading";

const styles = StyleSheet.create({
  header: {
    padding: Size[2],
  },
  image: {
    flex: 1,
    marginVertical: Size[2],
  },
});

interface PlayerViewMetaProps {
  track: Maybe<Track>;
  fetching?: boolean;
}

const PlayerViewMeta: FC<PlayerViewMetaProps> = ({ track, fetching }) => {
  return (
    <>
      <ImageBackground
        style={styles.image}
        resizeMode="contain"
        source={
          track?.image ? { uri: track?.image } : imageSources.defaultTrack
        }
        defaultSource={imageSources.defaultTrack}
        accessibilityLabel={track?.title}
      />
      <View style={styles.header}>
        {fetching ? (
          <SkeletonBlock width={27} height={3} />
        ) : (
          <Text size="xl" bold numberOfLines={1}>
            {track?.title}
          </Text>
        )}
        <Spacer y={3} />
        {fetching ? (
          <SkeletonBlock width={24} height={3} />
        ) : (
          <Text size="lg" color="textSecondary" numberOfLines={1}>
            {track?.artists.map((artist) => artist.name).join(", ")}
          </Text>
        )}
      </View>
    </>
  );
};

export default PlayerViewMeta;
