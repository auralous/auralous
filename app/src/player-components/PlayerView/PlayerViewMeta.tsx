import { IconMoreHorizontal, IconPlayListAdd } from "@/assets";
import imageDefaultTrack from "@/assets/images/default_track.jpg";
import spotifyLogoRGBWhite from "@/assets/images/Spotify_Logo_RGB_White.png";
import ytLogoMonoDark from "@/assets/images/yt_logo_mono_dark.png";
import { SkeletonBlock } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Text, TextMarquee } from "@/components/Typography";
import { usePlaybackError, usePlaybackProvidedTrackId } from "@/player";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import type { Maybe, Track } from "@auralous/api";
import { PlatformName, useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    padding: Size[2],
  },
  image: {
    flex: 1,
  },
  imageAndLogo: {
    flex: 1,
    marginVertical: Size[2],
  },
  moreBtn: {
    backgroundColor: "rgba(255,255,255,.2)",
    borderRadius: 9999,
    padding: Size[1],
  },
  nameAndArtist: {
    flex: 1,
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

  const playbackProvidedTrackId = usePlaybackProvidedTrackId();

  const [{ data }] = useTrackQuery({
    variables: { id: playbackProvidedTrackId as string },
  });

  return (
    <View>
      <Text align="center" color="textSecondary">
        {t("player.error.unplayable")}
      </Text>
      <Spacer y={4} />
      <Text align="center">
        {data?.track?.title} -{" "}
        {data?.track?.artists.map((artist) => artist.name).join(", ")}
      </Text>
    </View>
  );
};

const MetaButton: FC<{ track: Track | null | undefined }> = ({ track }) => {
  const { t } = useTranslation();
  const uiDispatch = useUiDispatch();
  const present = useCallback(() => {
    if (!track) return;
    uiDispatch({
      type: "contextMenu",
      value: {
        visible: true,
        title: track.title,
        subtitle: track.artists.map((artist) => artist.name).join(", "),
        image: track.image || undefined,
        items: [
          {
            icon: <IconPlayListAdd color={Colors.textSecondary} />,
            text: t("playlist.add_to_playlist.title"),
            onPress: () =>
              uiDispatch({
                type: "addToPlaylist",
                value: {
                  visible: true,
                  trackId: track.id,
                },
              }),
          },
        ],
      },
    });
  }, [track, t, uiDispatch]);
  return (
    <TouchableOpacity onPress={present} style={styles.moreBtn}>
      <IconMoreHorizontal />
    </TouchableOpacity>
  );
};

const PlayerViewMeta: FC<PlayerViewMetaProps> = ({ track, fetching }) => {
  const { t } = useTranslation();

  const providerLogoImageSource = useMemo(
    () => ({
      [PlatformName.Spotify]: spotifyLogoRGBWhite,
      [PlatformName.Youtube]: ytLogoMonoDark,
    }),
    []
  );

  const playbackError = usePlaybackError();

  if (playbackError) {
    return (
      <View style={styles.error}>
        {playbackError === "no_cross_track" ? (
          <ErrorNoCrossTrack />
        ) : (
          // @ts-ignore
          <Text>{t(`player.error.${playbackError}`)}</Text>
        )}
      </View>
    );
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
        <View style={styles.nameAndArtist}>
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
        <MetaButton track={track} />
      </View>
    </>
  );
};

export default PlayerViewMeta;
