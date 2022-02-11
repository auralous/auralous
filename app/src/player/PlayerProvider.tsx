import type { PlaybackCurrentContext } from "@/player";
import { useTrackColor } from "@/player-components/PlayerView/useTrackColor";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useUiDispatch } from "@/ui-context";
import {
  PlatformName,
  useClient,
  useMeQuery,
  useSessionCurrentLiveQuery,
  useSessionPingMutation,
} from "@auralous/api";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlaybackContext } from "./Context";
import { player } from "./playerSingleton";
import type { PlaybackContextProvided } from "./types";

const PlayerProviderInner: FC<{
  playbackCurrentContext: PlaybackCurrentContext | null;
}> = ({ children, playbackCurrentContext }) => {
  /**
   * This state determines:
   * - the track that should be played
   * - the track enqueued (next items)
   * - underlying fetching state
   */
  const [playbackState, setPlaybackState] = useState<PlaybackContextProvided>({
    fetching: false,
    nextItems: [],
    queuePlayingUid: null,
    trackId: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    player.on("play", onPlay); // Optimistic update
    player.on("pause", onPause); // Optimistic update
    player.on("playing", onPlay);
    player.on("paused", onPause);
    player.on("error", setError);
    player.on("playing_track_id", setPlayingTrackId);
    player.on("playback_state", setPlaybackState);
    return () => {
      player.off("play", onPlay);
      player.off("pause", onPause);
      player.off("playing", onPlay);
      player.off("paused", onPause);
      player.off("error", setError);
      player.off("playing_track_id", setPlayingTrackId);
      player.off("playback_state", setPlaybackState);
    };
  }, []);

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const playingPlatform = useMemo<PlatformName | null>(() => {
    // if me === undefined, it has not fetched
    if (me === undefined) return null;
    return me?.platform || PlatformName.Youtube;
  }, [me]);

  useEffect(() => {
    if (playingPlatform) player.setPlatform(playingPlatform);
  }, [playingPlatform]);

  const color = useTrackColor(playingTrackId);

  // live session specific
  const [, sessionPing] = useSessionPingMutation();
  useEffect(() => {
    if (!me) return;
    if (!playbackCurrentContext?.isLive) return;
    const pingInterval = setInterval(() => {
      sessionPing({ id: playbackCurrentContext.id![1] });
    }, 30 * 1000);
    return () => clearInterval(pingInterval);
  }, [playbackCurrentContext, me, sessionPing]);

  return (
    <PlaybackContext.Provider
      value={{
        playbackCurrentContext,
        playingTrackId,
        color,
        isPlaying,
        playingPlatform,
        accessToken: me?.accessToken || null,
        error: error?.message || null,
        ...playbackState,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const PlayerProvider: FC<{
  navigationRef: NavigationContainerRefWithCurrent<ParamList>;
}> = ({ children, navigationRef }) => {
  const client = useClient();

  const [playbackCurrentContext, setPlaybackCurrentContext] =
    useState<PlaybackCurrentContext | null>(null);

  useEffect(() => {
    player.commitContext(playbackCurrentContext);
  }, [playbackCurrentContext]);

  const uiDispatch = useUiDispatch();

  const [{ data: dataSessionCurrentLive }, refetchSessionCurrentLive] =
    useSessionCurrentLiveQuery({
      variables: { mine: true },
    });
  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  useEffect(refetchSessionCurrentLive, [
    me?.user.id,
    refetchSessionCurrentLive,
  ]);

  const liveCheckedUserId = useRef<undefined | string>(undefined);
  useEffect(() => {
    if (dataSessionCurrentLive?.sessionCurrentLive === undefined || !me?.user)
      return;
    if (liveCheckedUserId.current === me.user.id) return;
    liveCheckedUserId.current = me.user.id;
    const sessionId = dataSessionCurrentLive?.sessionCurrentLive?.sessionId;
    if (!sessionId) return undefined;
    setPlaybackCurrentContext({
      id: ["session", sessionId],
      shuffle: false,
      isLive: true,
    });
    navigationRef.current?.navigate(RouteName.Session, { id: sessionId });
  }, [dataSessionCurrentLive?.sessionCurrentLive, me, navigationRef]);

  useEffect(() => {
    player.playContext = async (
      currentContext: PlaybackCurrentContext | null
    ) => {
      if (currentContext) {
        if (
          dataSessionCurrentLive?.sessionCurrentLive &&
          (currentContext.id?.[0] !== "session" ||
            currentContext.id?.[1] !==
              dataSessionCurrentLive.sessionCurrentLive.sessionId)
        ) {
          return uiDispatch({
            type: "stopLiveOnPlay",
            value: {
              visible: true,
              intention: {
                sessionId: dataSessionCurrentLive.sessionCurrentLive.sessionId,
                nextPlaybackContext: currentContext,
              },
            },
          });
        }
      }
      setPlaybackCurrentContext(currentContext);
    };
  }, [client, uiDispatch, dataSessionCurrentLive]);

  return (
    <PlayerProviderInner playbackCurrentContext={playbackCurrentContext}>
      {children}
    </PlayerProviderInner>
  );
};
