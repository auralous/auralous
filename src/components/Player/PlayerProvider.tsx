import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Portal from "@reach/portal";
import Player from "./Player";
import PlayerContext from "./PlayerContext";
import { useNowPlaying } from "~/components/NowPlaying/index";
import { PlatformName, usePingRoomMutation } from "~/graphql/gql.gen";
import { useMAuth } from "~/hooks/user";
import { useCrossTracks } from "~/hooks/track";
import { IPlayerContext, PlayerError, PlayerPlaying } from "./types";

const YouTubePlayer = dynamic(() => import("./YouTubePlayer"), { ssr: false });
const SpotifyPlayer = dynamic(() => import("./SpotifyPlayer"), { ssr: false });

const player = new Player();

const PlayerProvider: React.FC = ({ children }) => {
  const {
    data: mAuth,
    isFetching: fetchingMAuth,
    refetch: mAuthRefetch,
  } = useMAuth();

  useEffect(() => {
    let t: number | undefined;
    if (mAuth?.expiredAt) {
      const tm = mAuth.expiredAt.getTime() - Date.now();
      // TODO: This indicates an error, report it
      if (tm < 0) return;
      t = window.setTimeout(mAuthRefetch, tm);
    }
    return () => window.clearTimeout(t);
  }, [mAuth, mAuthRefetch]);

  // Preferred platform to use by user
  const playingPlatform = useMemo<PlatformName>(
    () => mAuth?.platform || PlatformName.Youtube,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mAuth]
  );

  // Player Control: To play a room or a track
  const [playingRoomId, playRoom] = useState<string>("");

  useEffect(() => {
    if (playingRoomId) player.wasPlaying = true;
  }, [playingRoomId]);

  const [nowPlaying, { fetching: fetchingNP }] = useNowPlaying(playingRoomId);

  const [, pingRoom] = usePingRoomMutation();
  useEffect(() => {
    if (playingRoomId && mAuth) {
      const pingInterval = window.setInterval(() => {
        // tell server that user is still in room
        pingRoom({ id: playingRoomId });
      }, 30 * 1000);
      return () => window.clearInterval(pingInterval);
    }
  }, [playingRoomId, mAuth, pingRoom]);

  const [crossTracks, { fetching: fetchingCrossTracks }] = useCrossTracks(
    nowPlaying?.currentTrack?.trackId
  );

  // The track that is playing
  const playerPlaying = useMemo<PlayerPlaying>(() => {
    if (!crossTracks || !playingPlatform) return (player.playerPlaying = null);
    return (player.playerPlaying = crossTracks[playingPlatform] || null);
  }, [crossTracks, playingPlatform]);

  useEffect(() => {
    if (!nowPlaying) return undefined;

    let wasSeeked = false;

    const onPaused = () => (wasSeeked = false); // The player paused and should be seeked next time
    const onPlaying = async () => {
      if (!nowPlaying?.currentTrack) return;
      // When the player buffering due to seeking, this got triggered continously
      // We must treat buffering as "Playing"
      if (!wasSeeked) {
        // Resume to current live position
        // Delay a bit for player to load
        await new Promise((resolve) => {
          window.setTimeout(resolve, 1000);
        });
        player.seek(Date.now() - nowPlaying.currentTrack.playedAt.getTime());
        wasSeeked = true;
      }
    };
    player.on("playing", onPlaying);
    player.on("paused", onPaused);
    return () => {
      player.off("playing", onPlaying);
      player.off("paused", onPaused);
    };
  }, [nowPlaying]);

  // Player Component
  const [
    DynamicPlayer,
    setDynamicPlayer,
  ] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const handlePlayerChange = () => {
      if (fetchingCrossTracks) return;
      if (player.comparePlatform(playerPlaying?.platform || null)) {
        if (playerPlaying?.externalId)
          player.loadByExternalId(playerPlaying.externalId);
      } else {
        switch (playerPlaying?.platform) {
          case PlatformName.Youtube:
            setDynamicPlayer(YouTubePlayer);
            break;
          case PlatformName.Spotify:
            setDynamicPlayer(SpotifyPlayer);
            break;
          default:
            setDynamicPlayer(null);
        }
      }
    };
    // If the user pause the track before playerPlaying change, delay the switch until they press play again
    if (player.wasPlaying) {
      handlePlayerChange();
    } else {
      player.on("playing", handlePlayerChange);
      return () => player.off("playing", handlePlayerChange);
    }
  }, [playerPlaying?.platform, playerPlaying?.externalId, fetchingCrossTracks]);

  const fetching = fetchingMAuth || fetchingCrossTracks || fetchingNP;

  const playerContextValue = useMemo<IPlayerContext>(() => {
    let error: PlayerError | undefined;
    if (!!playingPlatform && !!crossTracks && !playerPlaying)
      error = PlayerError.NOT_AVAILABLE_ON_PLATFORM;
    return {
      state: {
        playerPlaying,
        playingRoomId,
        originalTrack: crossTracks?.original,
        playingPlatform,
        fetching,
        error,
      },
      playRoom,
      stopPlaying: () => playRoom(""),
      player,
    };
  }, [fetching, playerPlaying, playingRoomId, crossTracks, playingPlatform]);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <Portal>{DynamicPlayer && <DynamicPlayer />}</Portal>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
