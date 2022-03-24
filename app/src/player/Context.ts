import { createContext, useContext } from "react";
import type {
  PlaybackSelection,
  PlaybackStateAuth,
  PlaybackStateControl,
  PlaybackStateQueue,
  PlaybackStateSource,
  PlaybackStateStatus,
} from "./types";

export const PlaybackStateQueueContext = createContext(
  {} as PlaybackStateQueue
);
export const usePlaybackStateQueueContext = () =>
  useContext(PlaybackStateQueueContext);

export const PlaybackStateControlContext = createContext(
  {} as PlaybackStateControl
);
export const usePlaybackStateControlContext = () =>
  useContext(PlaybackStateControlContext);

export const PlaybackStateSourceContext = createContext(
  {} as PlaybackStateSource
);
export const usePlaybackStateSourceContext = () =>
  useContext(PlaybackStateSourceContext);

export const PlaybackStateAuthContext = createContext({} as PlaybackStateAuth);
export const usePlaybackStateAuthContext = () =>
  useContext(PlaybackStateAuthContext);

export const PlaybackStateStatusContext = createContext(
  {} as PlaybackStateStatus
);
export const usePlaybackStateStatusContext = () =>
  useContext(PlaybackStateStatusContext);

export const PlaybackSelectionContext = createContext<PlaybackSelection | null>(
  null
);
export const usePlaybackSelectionContext = () =>
  useContext(PlaybackSelectionContext);
