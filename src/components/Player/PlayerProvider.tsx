import React, { useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Portal from "@reach/portal";
import PlayerPlatformChooser from "./PlayerPlatformChooser";
import Player from "./Player";
import PlayerContext from "./PlayerContext";
import { useNowPlaying } from "~/components/NowPlaying/index";
import {
  useRoomQuery,
  CrossTracksWrapper,
  useMeAuthQuery,
  PlatformName,
  Track,
} from "~/graphql/gql.gen";
import { PlayerError, PlayerPlaying } from "./types";

const YouTubePlayer = dynamic(() => import("./Youtube"));
const SpotifyPlayer = dynamic(() => import("./Spotify"));

const player = new Player();

const PlayerProvider: React.FC = ({ children }) => {
  const [crossTracks, setCrossTracks] = useState<CrossTracksWrapper | null>(
    null
  );

  const [{ data: { meAuth } = { meAuth: undefined } }] = useMeAuthQuery();

  const [fRPP, forceResetPlayingPlatform] = useState({});

  const playingPlatform = useMemo<PlatformName | null>(
    () =>
      meAuth?.playingPlatform ||
      (typeof window !== "undefined"
        ? (window.sessionStorage.getItem(
            "playingPlatform"
          ) as PlatformName | null)
        : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meAuth, fRPP]
  );

  // Should only show platform chooser if there is an ongoing track and no playingPlatform can be determined
  const shouldShowPlatformChooser = useMemo<boolean>(
    () => !playingPlatform && !!crossTracks,
    [playingPlatform, crossTracks]
  );

  // The track that is playing
  const playerPlaying = useMemo<PlayerPlaying | null>(() => {
    if (!crossTracks || !playingPlatform) return null;
    return crossTracks[playingPlatform] || null;
  }, [crossTracks, playingPlatform]);

  const originalTrack = useMemo<Track | null>(() => {
    if (!crossTracks) return null;
    // Find the original tracks among crossTracks
    if (crossTracks.spotify?.id === crossTracks.originalId)
      return crossTracks.spotify || null;
    if (crossTracks.youtube?.id === crossTracks.originalId)
      return crossTracks.youtube || null;
    return null;
  }, [crossTracks]);

  // Player Control: To play a room or a track
  const [playerControl, setPlayerControl] = useState<string>("");

  const playRoom = useCallback(
    async (roomId: string) => {
      player.isPlaying = true;
      setPlayerControl(`room:${roomId}`);
    },
    [setPlayerControl]
  );

  const stopPlaying = useCallback(() => setPlayerControl(""), [
    setPlayerControl,
  ]);

  // room
  const [nowPlaying] = useNowPlaying(
    playerControl.split(":")[0],
    playerControl.split(":")[1]
  );

  useEffect(() => {
    if (!playerControl.startsWith("room:") && !nowPlaying) return undefined;

    let wasSeeked = false;

    const onPaused = () => (wasSeeked = false); // The player paused and should be seeked next time
    const onPlaying = async () => {
      if (!playerControl.startsWith("room:") || !nowPlaying?.currentTrack)
        return;
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
  }, [playerControl, nowPlaying]);

  // room

  const [{ data: { room } = { room: null } }] = useRoomQuery({
    variables: { id: playerControl.split(":")[1] },
    pause: !playerControl.startsWith("room:"),
  });

  useEffect(() => {
    if (playerControl.startsWith("room:") && nowPlaying?.currentTrack?.tracks)
      setCrossTracks(nowPlaying.currentTrack.tracks);
    else setCrossTracks(null);
  }, [nowPlaying, setCrossTracks, playerControl]);

  const playerContext = useMemo(
    () => ({
      ...(!!playerControl.startsWith("room:") && { room }),
    }),
    [playerControl, room]
  );

  // Player Component
  const [
    DynamicPlayer,
    setDynamicPlayer,
  ] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const handlePlayerChange = () => {
      if (player.comparePlatform(playerPlaying?.platform)) {
        if (playerPlaying?.externalId)
          player.loadByExternalId(playerPlaying.externalId);
      } else {
        const platform = playerPlaying?.platform;
        switch (platform) {
          case "youtube":
            setDynamicPlayer(YouTubePlayer);
            break;
          case "spotify":
            setDynamicPlayer(SpotifyPlayer);
            break;
          default:
            setDynamicPlayer(null);
        }
      }
    };
    // If the user pause the track before playerPlaying change, delay the switch until they press play again
    if (player.isPlaying) {
      handlePlayerChange();
    } else {
      player.on("playing", handlePlayerChange);
      return () => player.off("playing", handlePlayerChange);
    }
  }, [playerPlaying]);

  const playerContextValue = useMemo(() => {
    let error: PlayerError | undefined;
    if (!!playingPlatform && !!crossTracks && !playerPlaying)
      error = PlayerError.NOT_AVAILABLE_ON_PLATFORM;
    return {
      state: {
        playerPlaying,
        playerContext,
        playerControl,
        originalTrack,
        playingPlatform,
        error,
      },
      playRoom,
      stopPlaying,
      player,
      forceResetPlayingPlatform,
    };
  }, [
    playerPlaying,
    playerContext,
    playerControl,
    playRoom,
    stopPlaying,
    forceResetPlayingPlatform,
    originalTrack,
    crossTracks,
    playingPlatform,
  ]);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <Portal>{DynamicPlayer && <DynamicPlayer />}</Portal>
      <PlayerPlatformChooser
        // force crossTracks as a hack to rechoose playerPlaying
        onSelect={() => forceResetPlayingPlatform({})}
        active={shouldShowPlatformChooser}
      />
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
