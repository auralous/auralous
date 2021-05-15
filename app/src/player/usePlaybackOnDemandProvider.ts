import { useQueueQuery } from "@/gql/gql.gen";
import { useEffect, useState } from "react";
import { PlaybackContextType } from "./Context";
import Player from "./Player";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackOnDemandProvider = (
  player: Player,
  contextType: PlaybackContextType | null,
  contextId: string | null
) => {
  const contextData = usePlaybackContextData(contextType, contextId);

  const active = contextData.story?.isLive === false;

  const [{ data: dataQueue, fetching, stale: staleQueue }] = useQueueQuery({
    variables: { id: contextId + ":played" },
    pause: !active,
  });

  const queue = !staleQueue ? dataQueue?.queue : null;

  const [queueIndex, setQueueIndex] = useState(0);

  const canSkipBackward = !!queue && queueIndex > 0;
  const canSkipForward = !!queue && queueIndex < queue.items.length - 1;

  useEffect(() => {
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
  }, [player, queueIndex, canSkipBackward, canSkipForward]);

  return {
    queueIndex,
    trackId: queue?.items[queueIndex]?.trackId || null,
    canSkipBackward,
    canSkipForward,
    fetching,
  };
};

export default usePlaybackOnDemandProvider;
