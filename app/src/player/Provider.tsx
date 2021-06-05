import { PlatformName, useCrossTracksQuery } from "@/gql/gql.gen";
import React, { useEffect, useMemo, useState } from "react";
import {
  PlaybackContext,
  PlaybackCurrentContext,
  PlayerContext,
} from "./Context";
import Player from "./Player";
import PlayerSpotify from "./PlayerSpotify";
import PlayerView from "./PlayerView";
import PlayerYoutube from "./PlayerYoutube";
import usePlaybackAuthentication from "./usePlaybackAuthentication";
import usePlaybackContextProvider from "./usePlaybackContextProvider";
import { useTrackColors } from "./useTrackColors";

const player = new Player();

const Provider: React.FC = ({ children }) => {
  const [playbackCurrentContext, setContextSelector] =
    useState<PlaybackCurrentContext | null>(null);

  useEffect(() => {
    player.on("context", setContextSelector);
    return () => player.off("context", setContextSelector);
  }, []);

  const playbackProvided = usePlaybackContextProvider(
    player,
    playbackCurrentContext
  );

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    player.on("playing", onPlay);
    player.on("paused", onPause);
    return () => {
      player.off("playing", onPlay);
      player.off("paused", onPause);
    };
  }, []);

  const { playingPlatform, accessToken } = usePlaybackAuthentication();

  // Player Component
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    if (playbackCurrentContext) setHasPlayed(true);
  }, [playbackCurrentContext]);
  const DynamicPlayer = useMemo(() => {
    if (!playingPlatform || !hasPlayed) return null;
    if (playingPlatform === PlatformName.Youtube) return PlayerYoutube;
    return PlayerSpotify;
  }, [playingPlatform, hasPlayed]);

  // Get track data based on preferred playingPlatform

  const [
    {
      data: dataCrossTracks,
      fetching: fetchingCrossTracks,
      stale: staleCrossTracks,
    },
  ] = useCrossTracksQuery({
    variables: { id: playbackProvided?.trackId || "" },
    pause: !playbackProvided?.trackId,
  });

  const playingTrackId = useMemo(() => {
    const crossTracks =
      (!staleCrossTracks && dataCrossTracks?.crossTracks) || null;
    const platform = playingPlatform || PlatformName.Youtube;
    const externalId = crossTracks?.[platform];
    if (!externalId) return null;
    return `${platform}:${externalId}`;
  }, [dataCrossTracks, staleCrossTracks, playingPlatform]);

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

  // Colors for theme
  const colors = useTrackColors(playingTrackId);

  const playbackState = useMemo(
    () => ({
      playbackCurrentContext,
      canSkipBackward: !fetching && !!playbackProvided?.canSkipBackward,
      canSkipForward: !fetching && !!playbackProvided?.canSkipForward,
      trackId: playingTrackId,
      queueIndex: playbackProvided?.queueIndex || null,
      queue: playbackProvided?.queue || null,
      colors,
      fetching,
      isPlaying,
    }),
    [
      playbackCurrentContext,
      playbackProvided,
      isPlaying,
      playingTrackId,
      colors,
      fetching,
    ]
  );

  return (
    <PlayerContext.Provider value={player}>
      <PlaybackContext.Provider value={playbackState}>
        {DynamicPlayer && (
          <DynamicPlayer player={player} accessToken={accessToken} />
        )}
        <PlayerView />
        {children}
      </PlaybackContext.Provider>
    </PlayerContext.Provider>
  );
};

export default Provider;
