import imageDefaultTrack from "@/assets/images/default_track.jpg";
import spotifyLogoRGBWhite from "@/assets/images/Spotify_Logo_RGB_White.png";
import ytLogoMonoDark from "@/assets/images/yt_logo_mono_dark.png";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Text, TextMarquee } from "@/components/Typography";
import {
  usePlaybackAuthentication,
  usePlaybackError,
  usePlaybackProvidedTrackId,
} from "@/player";
import { Size } from "@/styles/spacing";
import type { Maybe, Track } from "@auralous/api";
import { PlatformName, useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: "center",
  },
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
    height: Size[6],
    marginBottom: Size[2],
    width: "auto",
  },
});

interface PlayerViewMetaProps {
  track: Maybe<Track>;
  fetching?: boolean;
}

const ErrorNoCrossTrack = () => {
  const { t } = useTranslation();
  const playbackAuthentication = usePlaybackAuthentication();

  const playbackProvidedTrackId = usePlaybackProvidedTrackId();

  const [{ data }] = useTrackQuery({
    variables: { id: playbackProvidedTrackId as string },
  });

  return (
    <View>
      <Text align="center" color="textSecondary">
        {t("player.error.no_cross_track", {
          platform: t(
            `music_platform.${playbackAuthentication.playingPlatform}.name`
          ),
        })}
      </Text>
      <Spacer y={4} />
      <Text align="center">
        {data?.track?.title} -{" "}
        {data?.track?.artists.map((artist) => artist.name).join(", ")}
      </Text>
    </View>
  );
};

const PlayerViewMeta: FC<PlayerViewMetaProps> = ({ track, fetching }) => {
  const providerLogoImageSource = useMemo(
    () => ({
      [PlatformName.Spotify]: spotifyLogoRGBWhite,
      [PlatformName.Youtube]: ytLogoMonoDark,
    }),
    []
  );

  const playbackError = usePlaybackError();

  if (playbackError) {
    if (playbackError === "no_cross_track") {
      return (
        <View style={styles.error}>
          <ErrorNoCrossTrack />
        </View>
      );
    }
  }

  return (
    <>
      <View style={styles.imageAndLogo}>
        {track?.platform && (
          <Image
            source={providerLogoImageSource[track.platform]}
            style={styles.platformLogo}
            resizeMode="contain"
          />
        )}
        <ImageBackground
          style={styles.image}
          resizeMode="contain"
          source={track?.image ? { uri: track?.image } : imageDefaultTrack}
          defaultSource={imageDefaultTrack}
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
