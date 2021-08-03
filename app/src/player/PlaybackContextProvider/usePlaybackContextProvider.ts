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

import { useMeQuery, useStoryPingMutation } from "@auralous/api";
import {
  PlaybackContextProvided,
  PlaybackContextType,
  PlaybackCurrentContext,
} from "@auralous/player";
import { useEffect } from "react";
import { usePlaybackContextMeta } from "./usePlaybackContextMeta";
import usePlaybackLiveProvider from "./usePlaybackLiveProvider";
import usePlaybackOnDemandProvider from "./usePlaybackOnDemandProvider";

const usePlaybackContextProvider = (
  playbackCurrentContext: PlaybackCurrentContext | null
): PlaybackContextProvided | null => {
  const contextMeta = usePlaybackContextMeta(playbackCurrentContext);

  const live = usePlaybackLiveProvider(
    !!contextMeta?.isLive,
    playbackCurrentContext
  );

  const onDemand = usePlaybackOnDemandProvider(
    !contextMeta?.isLive,
    playbackCurrentContext
  );

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const [, storyPing] = useStoryPingMutation();

  // Keep alive ping
  useEffect(() => {
    if (!me) return;
    if (contextMeta?.type === PlaybackContextType.Story && contextMeta.isLive) {
      const pingInterval = setInterval(() => {
        storyPing({ id: contextMeta.id });
      }, 30 * 1000);
      return () => clearInterval(pingInterval);
    }
  }, [me, contextMeta, storyPing]);

  if (!contextMeta) return null;
  if (contextMeta.isLive) return live;
  return onDemand;
};

export default usePlaybackContextProvider;
