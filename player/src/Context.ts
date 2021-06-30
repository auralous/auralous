import { QueueItem } from "@auralous/api";
import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

export enum PlaybackContextType {
  Story = "story",
  Playlist = "playlist",
}

/**
 * ContextUri has the form of {<type>,<id>}, defining
 * what the player will be playing.
 * ex. `{type:"story", id: "foo"}`, `{type:"playlist", id: "bar"}`
 */
export interface PlaybackCurrentContext {
  id: string;
  type: PlaybackContextType;
}

export interface PlaybackContextProvided {
  nextItems: QueueItem[];
  canSkipBackward: boolean;
  canSkipForward: boolean;
  trackId: string | null;
  fetching: boolean;
}

export interface PlaybackState extends PlaybackContextProvided {
  playbackCurrentContext: PlaybackCurrentContext | null;
  isPlaying: boolean;
  colors: [string, string];
}

export const PlaybackContext = createContext({} as PlaybackState);

export const usePlaybackState = () =>
  useContextSelector(PlaybackContext, (value) => value);

const nextItemsSelector = (value: PlaybackState) => value.nextItems;
export const usePlaybackNextItems = () =>
  useContextSelector(PlaybackContext, nextItemsSelector);

const playbackCurrentContextSelector = (value: PlaybackState) =>
  value.playbackCurrentContext;
export const usePlaybackCurrentContext = () =>
  useContextSelector(PlaybackContext, playbackCurrentContextSelector);

const playbackCurrentControlSelector = (value: PlaybackState) => ({
  isPlaying: value.isPlaying,
  canSkipBackward: value.canSkipBackward,
  canSkipForward: value.canSkipForward,
});
export const usePlaybackCurrentControl = () =>
  useContextSelector(PlaybackContext, playbackCurrentControlSelector);

const trackIdSelector = (value: PlaybackState) => value.trackId;
export const usePlaybackTrackId = () =>
  useContextSelector(PlaybackContext, trackIdSelector);

const playbackColorSelector = (value: PlaybackState) => value.colors;
export const usePlaybackColors = () =>
  useContextSelector(PlaybackContext, playbackColorSelector);
