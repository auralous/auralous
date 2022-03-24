import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useUIDispatch } from "@/ui-context";
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
import {
  PlaybackSelectionContext,
  PlaybackStateAuthContext,
  PlaybackStateControlContext,
  PlaybackStateQueueContext,
  PlaybackStateSourceContext,
  PlaybackStateStatusContext,
} from "./Context";
import { player } from "./playerSingleton";
import type {
  PlaybackSelection,
  PlaybackStateAuth,
  PlaybackStateControl,
  PlaybackStateQueue,
  PlaybackStateSource,
} from "./types";

const PlayerProviderInner: FC<{
  playbackSelection: PlaybackSelection | null;
}> = ({ children, playbackSelection }) => {
  /**
   * This state determines:
   * - the track that should be played
   * - the track enqueued (next items)
   */
  const [playbackStateQueue, setPlaybackStateQueue] =
    useState<PlaybackStateQueue>({
      nextItems: [],
      item: null,
    });
  const [playbackStateSource, setPlaybackStateSource] =
    useState<PlaybackStateSource>({ trackId: null });

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    player.on("state-queue", setPlaybackStateQueue);
    player.on("state-source", setPlaybackStateSource);

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    player.on("play", onPlay); // Optimistic update
    player.on("pause", onPause); // Optimistic update
    player.on("playing", onPlay);
    player.on("paused", onPause);
    player.on("loading", setLoading);
    return () => {
      player.off("state-queue", setPlaybackStateQueue);
      player.off("state-source", setPlaybackStateSource);

      player.off("play", onPlay);
      player.off("pause", onPause);
      player.off("playing", onPlay);
      player.off("paused", onPause);
      player.off("loading", setLoading);
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

  const playbackAuth = useMemo<PlaybackStateAuth>(
    () => ({
      accessToken: me?.accessToken || null,
      playingPlatform,
    }),
    [playingPlatform, me?.accessToken]
  );

  // live session specific
  const [, sessionPing] = useSessionPingMutation();
  useEffect(() => {
    if (!me) return;
    if (!playbackSelection?.isLive) return;
    const pingInterval = setInterval(() => {
      sessionPing({ id: playbackSelection.id![1] });
    }, 30 * 1000);
    return () => clearInterval(pingInterval);
  }, [playbackSelection, me, sessionPing]);

  const error = useMemo<string | null>(() => {
    if (loading) return null;
    if (playbackStateQueue.item?.trackId && !playbackStateSource.trackId)
      return "no_cross_track";
    return null;
  }, [loading, playbackStateQueue.item, playbackStateSource]);

  const status = useMemo(() => {
    return { fetching: loading, error };
  }, [loading, error]);

  const playbackStateControl = useMemo<PlaybackStateControl>(
    () => ({ isPlaying }),
    [isPlaying]
  );

  return (
    <PlaybackSelectionContext.Provider value={playbackSelection}>
      <PlaybackStateQueueContext.Provider value={playbackStateQueue}>
        <PlaybackStateControlContext.Provider value={playbackStateControl}>
          <PlaybackStateSourceContext.Provider value={playbackStateSource}>
            <PlaybackStateAuthContext.Provider value={playbackAuth}>
              <PlaybackStateStatusContext.Provider value={status}>
                {children}
              </PlaybackStateStatusContext.Provider>
            </PlaybackStateAuthContext.Provider>
          </PlaybackStateSourceContext.Provider>
        </PlaybackStateControlContext.Provider>
      </PlaybackStateQueueContext.Provider>
    </PlaybackSelectionContext.Provider>
  );
};

export const PlayerProvider: FC<{
  navigationRef: NavigationContainerRefWithCurrent<ParamList>;
}> = ({ children, navigationRef }) => {
  const client = useClient();
  const [playbackSelection, setPlaybackSelection] =
    useState<PlaybackSelection | null>(null);

  useEffect(() => {
    player.commitContext(playbackSelection);
  }, [playbackSelection]);

  const uiDispatch = useUIDispatch();

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
    setPlaybackSelection({
      id: ["session", sessionId],
      shuffle: false,
      isLive: true,
    });
    navigationRef.current?.navigate(RouteName.Session, { id: sessionId });
  }, [dataSessionCurrentLive?.sessionCurrentLive, me, navigationRef]);

  useEffect(() => {
    player.playContext = async (currentContext: PlaybackSelection | null) => {
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
                nextPlaybackSelection: currentContext,
              },
            },
          });
        }
      }
      setPlaybackSelection(currentContext);
    };
  }, [client, uiDispatch, dataSessionCurrentLive]);

  return (
    <PlayerProviderInner playbackSelection={playbackSelection}>
      {children}
    </PlayerProviderInner>
  );
};
