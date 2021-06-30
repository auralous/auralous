import {
  useMe,
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
import { usePlaybackContextMeta } from "./usePlaybackContextMeta";

const usePlaybackLiveProvider = (
  active: boolean,
  playbackContext: PlaybackCurrentContext | null
): PlaybackContextProvided => {
  const me = useMe();

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

  const [{ data: { queue } = { queue: undefined } }] = useQueueQuery({
    variables: {
      id: playbackContext?.id || "",
    },
    pause: !active,
  });
  useQueueUpdatedSubscription({
    variables: { id: queue?.id || "" },
    pause: !queue || !active,
  });
  const [, queueRemove] = useQueueRemoveMutation();
  const [, queueReorder] = useQueueReorderMutation();
  const [, queueToTop] = useQueueToTopMutation();
  const [, queueAdd] = useQueueAddMutation();

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

  const meta = usePlaybackContextMeta(playbackContext);

  const canSkipForward = Boolean(
    !fetchingSkip &&
      !!queue?.items.length &&
      me &&
      meta?.contextCollaborators?.includes(me.user.id)
  );

  useEffect(() => {
    if (!canSkipForward || !active || !queue?.id) return;
    const id = queue.id;
    const skipFn = () => skipNowPlaying({ id: queue.id });
    player.on("skip-forward", skipFn);
    const onReorder = (from: number, to: number) => {
      queueReorder({
        id,
        position: from,
        insertPosition: to,
      });
    };
    const onRemove = (uids: string[]) => {
      queueRemove({
        id,
        uids,
      });
    };
    const onPlayNext = (uids: string[]) => {
      queueToTop({
        id,
        uids,
      });
    };
    const onAdd = (trackIds: string[]) => {
      queueAdd({
        id,
        tracks: trackIds,
      });
    };
    player.on("queue-reorder", onReorder);
    player.on("queue-remove", onRemove);
    player.on("play-next", onPlayNext);
    player.on("queue-add", onAdd);
    return () => {
      player.off("skip-forward", skipFn);
      player.off("queue-reorder", onReorder);
      player.off("queue-remove", onRemove);
      player.off("play-next", onPlayNext);
      player.off("queue-add", onAdd);
    };
  }, [
    active,
    canSkipForward,
    skipNowPlaying,
    queue?.id,
    queueReorder,
    queueRemove,
    queueToTop,
    queueAdd,
  ]);

  return useMemo(
    () => ({
      nextItems: queue?.items || [],
      trackId: nowPlaying?.currentTrack?.trackId || null,
      canSkipForward,
      canSkipBackward: false,
      fetching,
    }),
    [queue, nowPlaying?.currentTrack?.trackId, fetching, canSkipForward]
  );
};

export default usePlaybackLiveProvider;
