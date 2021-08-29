import {
  useMeQuery,
  useNowPlayingPlayUidMutation,
  useNowPlayingQuery,
  useNowPlayingSkipMutation,
  useOnNowPlayingUpdatedSubscription,
  useQueueAddMutation,
  useQueueRemoveMutation,
  useQueueReorderMutation,
  useQueueToTopMutation,
  useSessionPingMutation,
  useSessionUpdatedSubscription,
} from "@auralous/api";
import type { FC } from "react";
import { useEffect } from "react";
import { player } from "../playerSingleton";
import type { PlaybackContextProvided, PlaybackCurrentContext } from "../types";

/**
 * This component takes over the state of playbackProvided in PlayerProvider
 * if the playback is a "live" one
 */
export const PlaybackProvidedLiveCallback: FC<{
  playbackContext: PlaybackCurrentContext;
  setPlaybackProvided(value: PlaybackContextProvided | null): void;
}> = ({ playbackContext, setPlaybackProvided }) => {
  const [{ data: { nowPlaying } = { nowPlaying: undefined }, fetching }] =
    useNowPlayingQuery({
      variables: { id: playbackContext.id },
      requestPolicy: "cache-and-network",
    });

  useOnNowPlayingUpdatedSubscription({
    variables: { id: playbackContext.id },
  });

  const [, doQueueRemove] = useQueueRemoveMutation();
  const [, doQueueReorder] = useQueueReorderMutation();
  const [, doQueueToTop] = useQueueToTopMutation();
  const [, doQueueAdd] = useQueueAddMutation();

  useEffect(() => {
    // We hook into `play` event to trigger
    // seeking to live position on resume
    if (!nowPlaying?.id) return undefined;
    let waitPlayTimeout: ReturnType<typeof setTimeout>;
    const onPlay = () => {
      // Resume to current live position
      // Delay a bit for player to load
      waitPlayTimeout = setTimeout(() => {
        player.seek(Date.now() - nowPlaying.current.playedAt.getTime());
      }, 1000);
    };

    player.on("play", onPlay);
    return () => {
      clearTimeout(waitPlayTimeout);
      player.off("play", onPlay);
    };
  }, [nowPlaying]);

  const [{ fetching: fetchingSkip }, skipNowPlaying] =
    useNowPlayingSkipMutation();

  const [{ fetching: fetchingPlayUid }, playUid] =
    useNowPlayingPlayUidMutation();

  useEffect(() => {
    const queueReorder = (from: number, to: number) => {
      doQueueReorder({
        id: playbackContext.id,
        position: from,
        insertPosition: to,
      });
    };
    const queueRemove = (uids: string[]) => {
      doQueueRemove({
        id: playbackContext.id,
        uids,
      });
    };
    const queueToTop = (uids: string[]) => {
      doQueueToTop({
        id: playbackContext.id,
        uids,
      });
    };
    const queueAdd = (trackIds: string[]) => {
      doQueueAdd({
        id: playbackContext.id,
        tracks: trackIds,
      });
    };
    const skipForward = () =>
      !fetchingSkip &&
      skipNowPlaying({ id: playbackContext.id, isBackward: false });
    const skipBackward = () =>
      !fetchingSkip &&
      skipNowPlaying({ id: playbackContext.id, isBackward: true });
    const queuePlayUid = (uid: string) =>
      !fetchingPlayUid && playUid({ id: playbackContext.id, uid });

    player.registerPlaybackHandle({
      skipForward,
      skipBackward,
      queuePlayUid,
      queueRemove,
      queueReorder,
      queueAdd,
      queueToTop,
    });

    return () => {
      player.unregisterPlaybackHandle();
    };
  }, [
    playbackContext.id,
    playUid,
    skipNowPlaying,
    doQueueReorder,
    doQueueRemove,
    doQueueToTop,
    doQueueAdd,
    fetchingSkip,
    fetchingPlayUid,
  ]);

  useSessionUpdatedSubscription({
    variables: { id: playbackContext.id },
    pause: playbackContext.type !== "session",
  });

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const [, sessionPing] = useSessionPingMutation();
  useEffect(() => {
    if (!me) return;
    if (playbackContext.type !== "session") return;
    const pingInterval = setInterval(() => {
      sessionPing({ id: playbackContext.id });
    }, 30 * 1000);
    return () => clearInterval(pingInterval);
  }, [playbackContext, me, sessionPing]);

  useEffect(() => {
    setPlaybackProvided({
      nextItems: nowPlaying?.next || [],
      trackId: nowPlaying?.current.trackId || null,
      fetching,
      queuePlayingUid: nowPlaying?.current.uid || null,
    });
  }, [nowPlaying, fetching, setPlaybackProvided]);

  useEffect(() => {
    return () => setPlaybackProvided(null);
  }, [setPlaybackProvided]);

  return null;
};
