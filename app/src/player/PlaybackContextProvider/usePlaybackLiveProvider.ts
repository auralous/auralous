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
  PlaybackContextType,
} from "@auralous/player";
import { useEffect } from "react";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackLiveProvider = (
  active: boolean,
  contextData: Extract<
    ReturnType<typeof usePlaybackContextData>,
    { type: PlaybackContextType.Story }
  >
): PlaybackContextProvided => {
  const me = useMe();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined }, fetching: fetchingNP },
  ] = useNowPlayingQuery({
    variables: { id: contextData?.data?.id || "" },
    pause: !active,
    requestPolicy: "cache-and-network",
  });
  useOnNowPlayingUpdatedSubscription({
    variables: { id: contextData?.data?.id || "" },
    pause: !active,
  });

  const [{ data: { queue } = { queue: undefined } }] = useQueueQuery({
    variables: {
      id: contextData?.data?.id || "",
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

  const canSkipForward = Boolean(
    !fetchingSkip &&
      !!queue?.items.length &&
      me &&
      (contextData?.data?.queueable.includes(me.user.id) ||
        contextData?.data?.creatorId === me?.user.id)
  );

  useEffect(() => {
    if (!canSkipForward || !active || !queue?.id) return;
    const id = queue.id;
    const skipFn = () => skipNowPlaying({ id: contextData?.data?.id || "" });
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
    queueReorder,
    queueRemove,
    canSkipForward,
    contextData,
    skipNowPlaying,
    queueToTop,
    queueAdd,
    queue?.id,
  ]);

  return {
    nextItems: queue?.items || [],
    trackId: nowPlaying?.currentTrack?.trackId || null,
    canSkipForward,
    canSkipBackward: false,
    fetching: fetchingNP,
  };
};

export default usePlaybackLiveProvider;
