import { ImageSources } from "@/assets";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { TextMarquee } from "@/components/Typography";
import { Size } from "@/styles";
import { Maybe, PlatformName, Track } from "@auralous/api";
import { FC } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  header: {
    padding: Size[2],
  },
  image: {
    flex: 1,
  },
  imageAndLogo: {
    flex: 1,
    marginVertical: Size[2],
  },
  platformLogo: {
    height: Size[8],
    marginBottom: Size[0.5],
    width: "auto",
  },
});

interface PlayerViewMetaProps {
  track: Maybe<Track>;
  fetching?: boolean;
}

const ProviderLogoImageSource = {
  [PlatformName.Spotify]: ImageSources.spotifyLogoRGBWhite,
  [PlatformName.Youtube]: ImageSources.ytLogoMonoDark,
};

const PlayerViewMeta: FC<PlayerViewMetaProps> = ({ track, fetching }) => {
  return (
    <>
      <View style={styles.imageAndLogo}>
        {track?.platform && (
          <Image
            source={ProviderLogoImageSource[track.platform]}
            style={styles.platformLogo}
            resizeMode="contain"
          />
        )}
        <ImageBackground
          style={styles.image}
          resizeMode="contain"
          source={
            track?.image ? { uri: track?.image } : ImageSources.defaultTrack
          }
          defaultSource={ImageSources.defaultTrack}
          accessibilityLabel={track?.title}
        />
      </View>
      <View style={styles.header}>
        {fetching ? (
          <SkeletonBlock width={27} height={3} />
        ) : (
          <TextMarquee size="xl" bold duration={10000}>
            {track?.title}
          </TextMarquee>
        )}
        <Spacer y={3} />
        {fetching ? (
          <SkeletonBlock width={24} height={3} />
        ) : (
          <TextMarquee size="lg" color="textSecondary" duration={10000}>
            {track?.artists.map((artist) => artist.name).join(", ")}
          </TextMarquee>
        )}
      </View>
    </>
  );
};

export default PlayerViewMeta;
