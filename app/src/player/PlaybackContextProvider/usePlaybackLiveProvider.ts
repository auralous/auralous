import {
  useNowPlayingQuery,
  useNowPlayingSkipMutation,
  useOnNowPlayingUpdatedSubscription,
  useQueueAddMutation,
  useQueueQuery,
  useQueueRemoveMutation,
  useQueueReorderMutation,
  useQueueToTopMutation,
  useQueueUpdatedSubscription,
} from "@auralous/api";
import player, {
  PlaybackContextProvided,
  PlaybackCurrentContext,
} from "@auralous/player";
import { useEffect, useMemo } from "react";

const usePlaybackLiveProvider = (
  active: boolean,
  playbackContext: PlaybackCurrentContext | null
): PlaybackContextProvided => {
  const [{ data: { nowPlaying } = { nowPlaying: undefined }, fetching }] =
    useNowPlayingQuery({
      variables: { id: playbackContext?.id || "" },
      pause: !active,
      requestPolicy: "cache-and-network",
    });

  useOnNowPlayingUpdatedSubscription({
    variables: { id: playbackContext?.id || "" },
    pause: !active,
  });

  const [{ data }] = useQueueQuery({
    variables: {
      id: playbackContext?.id || "",
    },
    pause: !active,
  });

  const queue = useMemo(
    () => (active ? data?.queue : undefined),
    [data, active]
  );

  useQueueUpdatedSubscription({
    variables: { id: queue?.id || "" },
    pause: !queue,
  });
  const [, doQueueRemove] = useQueueRemoveMutation();
  const [, doQueueReorder] = useQueueReorderMutation();
  const [, doQueueToTop] = useQueueToTopMutation();
  const [, doQueueAdd] = useQueueAddMutation();

  useEffect(() => {
    // We hook into `play` event to trigger
    // seeking to live position on resume
    if (!nowPlaying || !active) return undefined;
    let waitPlayTimeout: ReturnType<typeof setTimeout>;
    const onPlay = () => {
      const currentTrack = nowPlaying.currentTrack;
      if (!currentTrack) return;
      // Resume to current live position
      // Delay a bit for player to load
      waitPlayTimeout = setTimeout(() => {
        player.seek(Date.now() - currentTrack.playedAt.getTime());
      }, 1000);
    };

    player.on("play", onPlay);
    return () => {
      clearTimeout(waitPlayTimeout);
      player.off("play", onPlay);
    };
  }, [active, nowPlaying]);

  const [{ fetching: fetchingSkip }, skipNowPlaying] =
    useNowPlayingSkipMutation();

  useEffect(() => {
    if (!queue) return;
    const id = queue.id;
    const queueReorder = (from: number, to: number) => {
      doQueueReorder({
        id,
        position: from,
        insertPosition: to,
      });
    };
    const queueRemove = (uids: string[]) => {
      doQueueRemove({
        id,
        uids,
      });
    };
    const playNext = (uids: string[]) => {
      doQueueToTop({
        id,
        uids,
      });
    };
    const queueAdd = (trackIds: string[]) => {
      doQueueAdd({
        id,
        tracks: trackIds,
      });
    };
    const skipForward = () => !fetchingSkip && skipNowPlaying({ id: queue.id });
    const skipBackward = () => undefined;
    const queuePlayUid = () => undefined;

    player.registerPlaybackHandle({
      skipForward,
      skipBackward,
      queuePlayUid,
      queueRemove,
      queueReorder,
      queueAdd,
      playNext,
    });

    return () => {
      player.unregisterPlaybackHandle();
    };
  }, [
    queue,
    skipNowPlaying,
    doQueueReorder,
    doQueueRemove,
    doQueueToTop,
    doQueueAdd,
    fetchingSkip,
  ]);

  return useMemo(
    () => ({
      nextItems: queue?.items || [],
      trackId: nowPlaying?.currentTrack?.trackId || null,
      fetching,
    }),
    [queue, nowPlaying?.currentTrack?.trackId, fetching]
  );
};

export default usePlaybackLiveProvider;
