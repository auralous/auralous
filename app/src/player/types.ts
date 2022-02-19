import type { PlatformName, QueueItem } from "@auralous/api";

export interface PlaybackContextMeta {
  id: string;
  contextDescription: string;
  contextOwner?: string;
  imageUrl?: string | null;
  contextCollaborators?: string[];
  isLive: boolean;
  type: "session" | "playlist";
}

export interface PlaybackCurrentContext {
  id?: [type: PlaybackContextMeta["type"], entityId: string];
  shuffle: boolean;
  isLive?: boolean;
  initialIndex?: number;
  initialTracks?: string[];
}

export interface PlaybackContextProvided {
  nextItems: QueueItem[];
  trackId: string | null;
  queuePlayingUid: string | null;
}

export interface PlaybackState extends PlaybackContextProvided {
  playbackCurrentContext: PlaybackCurrentContext | null;
  isPlaying: boolean;
  color: string;
  playingPlatform: PlatformName | null;
  accessToken: string | null;
  error?: string | null;
  playingTrackId: string | null;
  fetching: boolean;
}
