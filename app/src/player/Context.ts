import {
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import type { PlaybackState } from "./types";

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
});
export const usePlaybackCurrentControl = () =>
  useContextSelector(PlaybackContext, playbackCurrentControlSelector);

const trackIdSelector = (value: PlaybackState) => value.trackId;
export const usePlaybackTrackId = () =>
  useContextSelector(PlaybackContext, trackIdSelector);

const providedTrackIdSelector = (value: PlaybackState) => value.providedTrackId;
export const usePlaybackProvidedTrackId = () =>
  useContextSelector(PlaybackContext, providedTrackIdSelector);

const queuePlayingUidSelector = (value: PlaybackState) => value.queuePlayingUid;
export const usePlaybackQueuePlayingId = () =>
  useContextSelector(PlaybackContext, queuePlayingUidSelector);

const playbackColorSelector = (value: PlaybackState) => value.color;
export const usePlaybackColor = () =>
  useContextSelector(PlaybackContext, playbackColorSelector);

export const playbackAuthenticationSelector = (value: PlaybackState) => ({
  playingPlatform: value.playingPlatform,
  accessToken: value.accessToken,
});

export const usePlaybackAuthentication = () =>
  useContextSelector(PlaybackContext, playbackAuthenticationSelector);

const playbackErrorSelector = (value: PlaybackState) => value.error;
export const usePlaybackError = () =>
  useContextSelector(PlaybackContext, playbackErrorSelector);