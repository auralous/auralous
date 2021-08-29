import { PlatformName, useCrossTracksQuery, useMeQuery } from "@auralous/api";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { PlaybackContext } from "./Context";
import { PlaybackProvidedCallback } from "./PlaybackContextProvider";
import { player } from "./playerSingleton";
import type {
  PlaybackContextProvided,
  PlaybackCurrentContext,
  PlaybackState,
} from "./types";

const PlayerProviderInner: FC<{
  playbackCurrentContext: PlaybackCurrentContext | null;
  useTrackColor: (trackId: string | null | undefined) => string;
}> = ({ children, playbackCurrentContext, useTrackColor }) => {
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
    player.playByExternalId(playingTrackId?.split(":")[1] || null);
  }, [playingTrackId]);

  // Listen when player actually play requested external id
  useEffect(() => {
    player.on("played_external", () => {
      if (player.__wasPlaying) player.play();
      else player.pause();
    });
  }, []);

  // Combine fetching states
  const fetching = Boolean(playbackProvided?.fetching || fetchingCrossTracks);

  const error = useMemo<PlaybackState["error"]>(() => {
    if (!fetching && !!playbackProvided?.trackId && !playingTrackId)
      return "no_cross_track";
    return null;
  }, [fetching, playingTrackId, playbackProvided?.trackId]);

  const color = useTrackColor(playingTrackId);

  return (
    <PlaybackContext.Provider
      value={{
        playbackCurrentContext,
        trackId: playingTrackId,
        providedTrackId: playbackProvided?.trackId || null,
        nextItems: playbackProvided?.nextItems || [],
        color,
        fetching,
        isPlaying,
        playingPlatform,
        accessToken: me?.accessToken || null,
        queuePlayingUid: playbackProvided?.queuePlayingUid || null,
        error,
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
  playbackCurrentContext: PlaybackCurrentContext | null;
  useTrackColor: (trackId: string | null | undefined) => string;
}> = ({ children, playbackCurrentContext, useTrackColor }) => {
  return (
    <PlayerProviderInner
      playbackCurrentContext={playbackCurrentContext}
      useTrackColor={useTrackColor}
    >
      {children}
    </PlayerProviderInner>
  );
};
