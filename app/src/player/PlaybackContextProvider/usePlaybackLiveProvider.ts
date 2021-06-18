import {
  useNowPlayingQuery,
  useNowPlayingSkipMutation,
  useOnNowPlayingUpdatedSubscription,
  useQueueQuery,
  useQueueRemoveMutation,
  useQueueReorderMutation,
  useQueueToTopMutation,
  useQueueUpdatedSubscription,
} from "@/gql/gql.gen";
import { useMe } from "@/gql/hooks";
import { PlaybackContextProvided, player } from "@/player/Context";
import { useEffect } from "react";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackLiveProvider = (
  active: boolean,
  contextData: ReturnType<typeof usePlaybackContextData>
): PlaybackContextProvided => {
  const me = useMe();

  const [
    { data: { nowPlaying } = { nowPlaying: undefined }, fetching: fetchingNP },
  ] = useNowPlayingQuery({
    variables: { id: contextData?.id || "" },
    pause: !active,
    requestPolicy: "cache-and-network",
  });
  useOnNowPlayingUpdatedSubscription({
    variables: { id: contextData?.id || "" },
    pause: !active,
  });

  const [{ data: { queue } = { queue: undefined } }] = useQueueQuery({
    variables: {
      id: contextData?.id || "",
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
      (contextData?.queueable.includes(me.user.id) ||
        contextData?.creatorId === me?.user.id)
  );

  useEffect(() => {
    if (!canSkipForward || !active || !queue?.id) return;
    const id = queue.id;
    const skipFn = () => skipNowPlaying({ id: contextData?.id || "" });
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
    player.on("queue-reorder", onReorder);
    player.on("queue-remove", onRemove);
    player.on("play-next", onPlayNext);
    return () => {
      player.off("skip-forward", skipFn);
      player.off("queue-reorder", onReorder);
      player.off("queue-remove", onRemove);
      player.off("play-next", onPlayNext);
    };
  }, [
    active,
    queueReorder,
    queueRemove,
    canSkipForward,
    contextData,
    skipNowPlaying,
    queueToTop,
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
