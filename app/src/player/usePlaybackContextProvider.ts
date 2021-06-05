/**
 * PlaybackContextProvider
 * We have two types of playback.
 *
 * A live playback, which includes:
 *   - Live Story
 *   - Radio
 * A onDemand playback, which includes:
 *   - Offline Story
 *   - Playlist
 *
 * Depending on playbackCurrentContext, we can choose between them
 */

import { useMemo } from "react";
import { PlaybackContextProvided, PlaybackCurrentContext } from "./Context";
import Player from "./Player";
import { usePlaybackContextData } from "./usePlaybackContextData";
import usePlaybackLiveProvider from "./usePlaybackLiveProvider";
import usePlaybackOnDemandProvider from "./usePlaybackOnDemandProvider";

const usePlaybackContextProvider = (
  player: Player,
  playbackCurrentContext: PlaybackCurrentContext | null
): PlaybackContextProvided | null => {
  const contextData = usePlaybackContextData(playbackCurrentContext);
  const playbackMode: "live" | "onDemand" | null = useMemo(() => {
    if (!contextData) return null;
    if (contextData.__typename === "Story") {
      if (contextData.isLive) return "live";
      return "onDemand";
    }
    return null;
  }, [contextData]);

  const liveProvided = usePlaybackLiveProvider(
    playbackMode === "live",
    player,
    contextData
  );

  const onDemandProvided = usePlaybackOnDemandProvider(
    playbackMode === "onDemand",
    player,
    contextData
  );

  return playbackMode === "live" ? liveProvided : onDemandProvided;
};

export default usePlaybackContextProvider;
