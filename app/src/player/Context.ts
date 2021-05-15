import { createContext, useContext } from "react";
import Player from "./Player";

export enum PlaybackContextType {
  Story = "story",
  Playlist = "playlist",
}

export interface PlaybackState {
  contextId: string | null;
  contextType: PlaybackContextType | null;
  canSkipBackward: boolean;
  canSkipForward: boolean;
  trackId: string | null;
  queueIndex: number | null;
  fetching: boolean;
  isPlaying: boolean;
}

export const PlaybackContext = createContext({} as PlaybackState);
export const PlayerContext = createContext({} as Player);

export const usePlayer = () => useContext(PlayerContext);
export const usePlaybackState = () => useContext(PlaybackContext);
