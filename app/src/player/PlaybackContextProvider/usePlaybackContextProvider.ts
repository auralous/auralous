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

import { Story } from "@auralous/api";
import {
  PlaybackContextProvided,
  PlaybackContextType,
  PlaybackCurrentContext,
} from "@auralous/player";
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
    if (
      contextData.type === PlaybackContextType.Story &&
      contextData.data?.isLive
    ) {
      return "live";
    }
    return "onDemand";
  }, [contextData]);

  const o = {
    live: usePlaybackLiveProvider(
      playbackMode === "live",
      contextData as { data: Story | null; type: PlaybackContextType.Story }
    ),
    onDemand: usePlaybackOnDemandProvider(
      playbackMode === "onDemand",
      contextData
    ),
  };
  if (!playbackMode) return null;
  return o[playbackMode];
};

export default usePlaybackContextProvider;
