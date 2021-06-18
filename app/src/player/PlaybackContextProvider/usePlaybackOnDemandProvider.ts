import { QueueItem, useQueueQuery } from "@/gql/gql.gen";
import { PlaybackContextProvided, player } from "@/player/Context";
import { useEffect, useMemo, useState } from "react";
import { usePlaybackContextData } from "./usePlaybackContextData";

const usePlaybackOnDemandProvider = (
  active: boolean,
  contextData: ReturnType<typeof usePlaybackContextData>
): PlaybackContextProvided => {
  const [{ data: dataQueue, fetching }] = useQueueQuery({
    variables: { id: contextData?.id + ":played" },
    pause: !active,
  });

  const [localQueueItems, setLocalQueueItems] = useState<QueueItem[]>([]);

  const [playingIndex, setPlayingIndex] = useState(0);

  useEffect(() => {
    setLocalQueueItems(dataQueue?.queue?.items || []);
  }, [dataQueue?.queue]);

  const nextItems = useMemo(() => {
    return localQueueItems.slice(playingIndex + 1);
  }, [localQueueItems, playingIndex]);

  const canSkipBackward = !!dataQueue?.queue && playingIndex > 0;
  const canSkipForward = nextItems.length > 0;

  useEffect(() => {
    if (!active) return;
    const onEnded = () => (canSkipForward ? skipForward() : player.pause());
    player.on("play-index", setPlayingIndex);
    player.on("ended", onEnded);
    const skipForward = () =>
      canSkipForward && setPlayingIndex(playingIndex + 1);
    const skipBackward = () =>
      canSkipBackward && setPlayingIndex(playingIndex - 1);
    player.on("skip-forward", skipForward);
    player.on("skip-backward", skipBackward);
    const onReorder = (from: number, to: number, data: QueueItem[]) => {
      // data is the array of only nextItems,
      // we have to merge it with the played tracks
      setLocalQueueItems((prevLocalQueueItems) => [
        ...prevLocalQueueItems.slice(0, playingIndex + 1),
        ...data,
      ]);
    };
    player.on("queue-reorder", onReorder);
    const onRemove = (uids: string[]) => {
      setLocalQueueItems((localQueueItems) =>
        localQueueItems.filter((item) => !uids.includes(item.uid))
      );
    };
    player.on("queue-remove", onRemove);
    const onPlayNext = (uids: string[]) => {
      setLocalQueueItems((prevLocalQueueItems) => {
        const toTopItems: QueueItem[] = [];
        const afterQueueItems = prevLocalQueueItems
          .slice(playingIndex + 1)
          .filter((item) => {
            if (uids.includes(item.uid)) {
              toTopItems.push(item);
              return false;
            }
            return true;
          });
        return [
          ...prevLocalQueueItems.slice(0, playingIndex + 1),
          ...toTopItems,
          ...afterQueueItems,
        ];
      });
    };
    player.on("play-next", onPlayNext);
    return () => {
      player.off("play-index", setPlayingIndex);
      player.off("ended", onEnded);
      player.off("skip-forward", skipForward);
      player.off("skip-backward", skipBackward);
      player.off("queue-reorder", onReorder);
      player.off("queue-remove", onRemove);
      player.off("play-next", onPlayNext);
    };
  }, [active, playingIndex, canSkipBackward, canSkipForward]);

  return {
    nextItems,
    trackId: localQueueItems[playingIndex]?.trackId || null,
    canSkipBackward,
    canSkipForward,
    fetching,
  };
};

export default usePlaybackOnDemandProvider;
