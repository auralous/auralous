import {
  useNowPlayingQuery,
  useNowPlayingSkipMutation,
  useOnNowPlayingUpdatedSubscription,
  useQueueQuery,
  useQueueReorderMutation,
  useQueueUpdatedSubscription,
} from "@/gql/gql.gen";
import { useMe } from "@/gql/hooks";
import { useEffect } from "react";
import { PlaybackContextProvided } from "./Context";
import Player from "./Player";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackLiveProvider = (
  active: boolean,
  player: Player,
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
    pause: !queue,
  });

  const [, queueReorder] = useQueueReorderMutation();

  useEffect(() => {
    // We hook into `play` event to trigger
    // seeking to live position on resume
    if (!nowPlaying) return undefined;
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
  }, [player, nowPlaying]);

  const [{ fetching: fetchingSkip }, skipNowPlaying] =
    useNowPlayingSkipMutation();

  const canSkipForward = Boolean(
    active &&
      !fetchingSkip &&
      !!queue?.items.length &&
      me &&
      (contextData?.queueable.includes(me.user.id) ||
        contextData?.creatorId === me?.user.id)
  );

  useEffect(() => {
    if (!canSkipForward || !active) return;
    const skipFn = () => skipNowPlaying({ id: contextData?.id || "" });
    player.on("skip-forward", skipFn);
    const onReorder = (from: number, to: number) => {
      queueReorder({
        id: queue?.id || "",
        position: from,
        insertPosition: to,
      });
    };
    player.on("queue-reorder", onReorder);
    return () => {
      player.off("skip-forward", skipFn);
      player.off("queue-reorder", onReorder);
    };
  }, [
    active,
    player,
    queueReorder,
    canSkipForward,
    contextData,
    skipNowPlaying,
    queue,
  ]);

  return {
    queue: queue || null,
    queueIndex: -1,
    trackId: nowPlaying?.currentTrack?.trackId || null,
    canSkipForward,
    canSkipBackward: false,
    fetching: fetchingNP,
  };
};

export default usePlaybackLiveProvider;
