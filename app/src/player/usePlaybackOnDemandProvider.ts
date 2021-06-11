import { useQueueQuery } from "@/gql/gql.gen";
import { useEffect, useState } from "react";
import { PlaybackContextProvided } from "./Context";
import Player from "./Player";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackOnDemandProvider = (
  active: boolean,
  player: Player,
  contextData: ReturnType<typeof usePlaybackContextData>
): PlaybackContextProvided => {
  const [{ data: dataQueue, fetching, stale: staleQueue }] = useQueueQuery({
    variables: { id: contextData?.id + ":played" },
    pause: !active,
  });

  const queue = !staleQueue ? dataQueue?.queue : null;

  const [queueIndex, setQueueIndex] = useState(0);

  const canSkipBackward = !!queue && queueIndex > 0;
  const canSkipForward = !!queue && queueIndex < queue.items.length - 1;

  useEffect(() => {
    if (!active) return;
    const skipForward = () => canSkipForward && setQueueIndex(queueIndex + 1);
    const skipBackward = () => canSkipBackward && setQueueIndex(queueIndex - 1);
    const onEnded = () => (canSkipForward ? skipForward() : player.pause());
    player.on("play-index", setQueueIndex);
    player.on("skip-forward", skipForward);
    player.on("skip-backward", skipBackward);
    player.on("ended", onEnded);
    return () => {
      player.off("play-index", setQueueIndex);
      player.off("skip-forward", skipForward);
      player.off("skip-backward", skipBackward);
      player.off("ended", onEnded);
    };
  }, [active, player, queueIndex, canSkipBackward, canSkipForward]);

  return {
    queue: queue || null,
    queueIndex,
    trackId: queue?.items[queueIndex]?.trackId || null,
    canSkipBackward,
    canSkipForward,
    fetching,
  };
};

export default usePlaybackOnDemandProvider;
