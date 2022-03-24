import type { PlatformName, QueueItem } from "@auralous/api";

export interface PlaybackStateQueue {
  nextItems: QueueItem[];
  item: QueueItem | null;
}

export interface PlaybackStateControl {
  isPlaying: boolean;
}

export interface PlaybackStateSource {
  trackId: string | null;
}

export interface PlaybackStateAuth {
  playingPlatform: PlatformName | null;
  accessToken: string | null;
}

export interface PlaybackStateStatus {
  error?: string | null;
  fetching: boolean;
}

export interface PlaybackSelection {
  id?: [type: PlaybackCurrentMeta["type"], entityId: string];
  shuffle: boolean;
  isLive?: boolean;
  initialIndex?: number;
  initialTracks?: string[];
}

export interface PlaybackCurrentMeta {
  id: string;
  contextDescription: string;
  contextOwner?: string;
  imageUrl?: string | null;
  contextCollaborators?: string[];
  isLive: boolean;
  type: "session" | "playlist";
}
