import { PlatformName, useCrossTracksQuery } from "@/gql/gql.gen";
import React, { useEffect, useMemo, useState } from "react";
import { PlaybackContext, PlaybackContextType, PlayerContext } from "./Context";
import Player from "./Player";
import PlayerSpotify from "./PlayerSpotify";
import PlayerView from "./PlayerView";
import PlayerYoutube from "./PlayerYoutube";
import usePlaybackAuthentication from "./usePlaybackAuthentication";
import usePlaybackLiveProvider from "./usePlaybackLiveProvider";
import usePlaybackOnDemandProvider from "./usePlaybackOnDemandProvider";

const player = new Player();

const Provider: React.FC = ({ children }) => {
  /**
   * ContextUri has the form of <type>:<id>, defining
   * what the player will be playing.
   * ex. `'story:abc123efg'`, `'playlist:zxc789qwe'`
   */
  const [contextUri, playContextUri] = useState<
    `${PlaybackContextType}:${string}` | null
  >(null);

  useEffect(() => {
    player.on("context", playContextUri);
    return () => player.off("context", playContextUri);
  }, []);

  const { contextType, contextId } = useMemo(() => {
    if (!contextUri) return { contextType: null, contextId: null };
    // set player.__wasPlaying to start playing now
    player.__wasPlaying = true;
    // split to get context parts
    const [contextType, contextId] = contextUri?.split(":");
    return { contextType: contextType as PlaybackContextType, contextId };
  }, [contextUri]);

  /**
   * Use provided data from either from one of the two hooks:
   * - usePlaybackOnDemandProvider: for offline story or playlist
   * - usePlayerLive: for ongoing story
   */
  const providedOnDemand = usePlaybackOnDemandProvider(
    player,
    contextType,
    contextId
  );
  const providedLive = usePlaybackLiveProvider(player, contextType, contextId);

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
    if (contextUri) setHasPlayed(true);
  }, [contextUri]);
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
    variables: { id: providedOnDemand.trackId || providedLive.trackId || "" },
    pause: !(providedOnDemand.trackId || providedLive.trackId),
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
  const fetching =
    providedOnDemand.fetching || providedLive.fetching || fetchingCrossTracks;

  const playbackState = useMemo(
    () => ({
      contextId,
      contextType,
      canSkipBackward:
        !fetching &&
        (providedOnDemand.canSkipBackward || providedLive.canSkipBackward),
      canSkipForward:
        !fetching &&
        (providedOnDemand.canSkipForward || providedLive.canSkipForward),
      trackId: playingTrackId,
      queueIndex: providedOnDemand.queueIndex || providedLive.queueIndex,
      fetching,
      isPlaying,
    }),
    [
      contextId,
      contextType,
      providedLive,
      providedOnDemand,
      isPlaying,
      playingTrackId,
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
