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

import {
  PlaybackContextProvided,
  PlaybackCurrentContext,
} from "@/player/Context";
import { useMemo } from "react";
import { usePlaybackContextData } from "./usePlaybackContextData";
import usePlaybackLiveProvider from "./usePlaybackLiveProvider";
import usePlaybackOnDemandProvider from "./usePlaybackOnDemandProvider";

const usePlaybackContextProvider = (
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
    contextData
  );

  const onDemandProvided = usePlaybackOnDemandProvider(
    playbackMode === "onDemand",
    contextData
  );

  return playbackMode === "live" ? liveProvided : onDemandProvided;
};

export default usePlaybackContextProvider;
