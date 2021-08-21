import { PlatformName, useCrossTracksQuery, useMeQuery } from "@auralous/api";
import { FC, useEffect, useMemo, useState } from "react";
import { Client, Provider } from "urql";
import { PlaybackContext } from "./Context";
import { PlaybackProvidedCallback } from "./PlaybackContextProvider";
import { player } from "./playerSingleton";
import { PlaybackContextProvided, PlaybackCurrentContext } from "./types";

const PlayerProviderInner: FC<{
  useTrackColor: (trackId: string | null | undefined) => string;
}> = ({ children, useTrackColor }) => {
  const [playbackCurrentContext, setPlaybackCurrentContext] =
    useState<PlaybackCurrentContext | null>(null);

  useEffect(() => {
    // Every time an intent is sent, set __wasPlaying = true
    player.__wasPlaying = true;
  }, [playbackCurrentContext]);

  /**
   * This state determines:
   * - the track that should be played
   * - the track enqueued (next items)
   * - underlying fetching state
   */
  const [playbackProvided, setPlaybackProvided] =
    useState<PlaybackContextProvided | null>(null);

  useEffect(() => {
    player.setPlaybackCurrentContext = setPlaybackCurrentContext;
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    player.on("play", onPlay); // Optimistic update
    player.on("pause", onPause); // Optimistic update
    player.on("playing", onPlay);
    player.on("paused", onPause);
    return () => {
      player.off("play", onPlay);
      player.off("pause", onPause);
      player.off("playing", onPlay);
      player.off("paused", onPause);
    };
  }, []);

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  const playingPlatform = useMemo<PlatformName | null>(() => {
    // if me === undefined, it has not fetched
    if (me === undefined) return null;
    return me?.platform || PlatformName.Youtube;
  }, [me]);

  // Get track data based on preferred playingPlatform
  const [{ data: dataCrossTracks, fetching: fetchingCrossTracks }] =
    useCrossTracksQuery({
      variables: { id: playbackProvided?.trackId || "" },
      pause: !playbackProvided?.trackId,
    });

  // paused query can still return data so we do an extra check
  const crossTracks = playbackProvided?.trackId
    ? dataCrossTracks?.crossTracks
    : null;

  const playingTrackId = useMemo(() => {
    // Use playingPlatform or fallback to YouTube as preferred platform
    const platform = playingPlatform || PlatformName.Youtube;

    // If source track id is the same as preferred, use as it
    if (playbackProvided?.trackId?.split(":")[0] === platform)
      return playbackProvided?.trackId;

    const externalId = crossTracks?.[platform];
    if (!externalId) return null;
    return `${platform}:${externalId}`;
  }, [crossTracks, playingPlatform, playbackProvided?.trackId]);

  // Control the player using playerPlaying

  useEffect(() => {
    const handlePlayerChange = () => {
      player.off("play", handlePlayerChange);
      player.playByExternalId(playingTrackId?.split(":")[1] || null);
    };
    // If the user paused the track before playerPlaying change,
    // delay the switch until they press play again to avoid
    // unexpected play

    if (player.__wasPlaying) {
      handlePlayerChange();
    } else {
      player.on("play", handlePlayerChange);
      return () => player.off("play", handlePlayerChange);
    }
  }, [playingTrackId]);

  // Combine fetching states
  const fetching = Boolean(playbackProvided?.fetching || fetchingCrossTracks);

  const color = useTrackColor(playingTrackId);

  return (
    <PlaybackContext.Provider
      value={{
        playbackCurrentContext,
        trackId: playingTrackId,
        nextItems: playbackProvided?.nextItems || [],
        color,
        fetching,
        isPlaying,
        playingPlatform,
        accessToken: me?.accessToken || null,
        queuePlayingUid: playbackProvided?.queuePlayingUid || null,
      }}
    >
      <PlaybackProvidedCallback
        setPlaybackProvided={setPlaybackProvided}
        playbackCurrentContext={playbackCurrentContext}
      />
      {children}
    </PlaybackContext.Provider>
  );
};

export const PlayerProvider: FC<{
  useTrackColor: (trackId: string | null | undefined) => string;
  client: Client;
}> = ({ children, useTrackColor, client }) => {
  return (
    <Provider value={client}>
      <PlayerProviderInner useTrackColor={useTrackColor}>
        {children}
      </PlayerProviderInner>
    </Provider>
  );
};
