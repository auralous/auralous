import { PlatformName, QueueItem } from "@auralous/api";

export interface PlaybackContextMeta {
  id: string;
  contextDescription: string;
  contextOwner?: string;
  imageUrl?: string | null;
  contextCollaborators?: string[];
  isLive: boolean;
  type: "story" | "playlist";
}

/**
 * ContextUri has the form of {<type>,<id>}, defining
 * what the player will be playing.
 * ex. `{type:"story", id: "foo"}`, `{type:"playlist", id: "bar"}`
 */
export interface PlaybackCurrentContext {
  id: string;
  type: PlaybackContextMeta["type"];
  shuffle: boolean;
  initialIndex?: number;
}

export interface PlaybackContextProvided {
  nextItems: QueueItem[];
  trackId: string | null;
  fetching: boolean;
  queuePlayingUid: string | null;
}

export interface PlaybackState extends PlaybackContextProvided {
  playbackCurrentContext: PlaybackCurrentContext | null;
  isPlaying: boolean;
  color: string;
  playingPlatform: PlatformName | null;
  accessToken: string | null;
  error?: "no_cross_track" | null;
  providedTrackId: string | null;
}
