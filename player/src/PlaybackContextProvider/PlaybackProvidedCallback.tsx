import { FC } from "react";
import { PlaybackContextProvided, PlaybackCurrentContext } from "../types";
import { PlaybackProvidedLiveCallback } from "./PlaybackProvidedLiveCallback";
import { PlaybackProvidedOnDemandCallback } from "./PlaybackProvidedOnDemandCallback";
import { usePlaybackContextMeta } from "./usePlaybackContextMeta";

/**
 * PlaybackProvidedCallback
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
 * and it will callback with the applicable PlaybackContextProvided
 *
 * This component set the state playbackProvided in PlayerProvider
 * via callback. See the two components used inside for more detail.
 */
export const PlaybackProvidedCallback: FC<{
  playbackCurrentContext: PlaybackCurrentContext | null;
  setPlaybackProvided(value: PlaybackContextProvided | null): void;
}> = ({ playbackCurrentContext, setPlaybackProvided }) => {
  const contextMeta = usePlaybackContextMeta(playbackCurrentContext);

  if (!contextMeta) return null;

  if (contextMeta.isLive)
    return (
      <PlaybackProvidedLiveCallback
        playbackContext={playbackCurrentContext as PlaybackCurrentContext}
        setPlaybackProvided={setPlaybackProvided}
      />
    );

  return (
    <PlaybackProvidedOnDemandCallback
      playbackContext={playbackCurrentContext as PlaybackCurrentContext}
      setPlaybackProvided={setPlaybackProvided}
    />
  );
};
