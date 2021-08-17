import { PlaybackCurrentContext } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
type HandlerFn = Function;

interface PlayerHandle {
  play: () => void;
  seek: (ms: number) => void;
  isPlaying: () => boolean;
  pause: () => void;
  playByExternalId: (externalId: string | null) => void;
  setVolume: (percentage: number) => void;
}

interface PlaybackHandle {
  skipForward(): void;
  skipBackward(): void;
  playNext(uids: string[]): void;
  queuePlayUid(uid: string): void;
  queueReorder(from: number, to: number): void;
  queueRemove(uids: string[]): void;
  queueAdd(trackIds: string[]): void;
}

interface Player {
  on(
    state: "context",
    fn: (context: null | PlaybackCurrentContext) => void
  ): void;
  on(state: "play", fn: () => void): void; // Trigger play
  on(state: "pause", fn: () => void): void; // Trigger pause
  on(state: "playing", fn: () => void): void; // Actually playing
  on(state: "paused", fn: () => void): void; // Actually pausing
  on(state: "seeked", fn: () => void): void;
  on(state: "ended", fn: () => void): void;
  on(state: "time", fn: (ms: number) => void): void;
  off(state: "context", fn: (context: PlaybackCurrentContext) => void): void;
  off(state: "play", fn: () => void): void;
  off(state: "pause", fn: () => void): void;
  off(state: "playing", fn: () => void): void;
  off(state: "paused", fn: () => void): void;
  off(state: "seeked", fn: () => void): void;
  off(state: "ended", fn: () => void): void;
  off(state: "time", fn: (ms: number) => void): void;
  emit(
    state: "context",
    fn: (context: null | PlaybackCurrentContext) => void
  ): void;
  emit(state: "play"): void; // Trigger play
  emit(state: "pause"): void; // Trigger pause
  emit(state: "playing"): void; // Actually playing
  emit(state: "paused"): void; // Actually pausing
  emit(state: "seeked"): void;
  emit(state: "ended"): void;
  emit(state: "time", ms: number): void;
}

class Player {
  private ee: Record<string, HandlerFn[]>;
  private playerFn: PlayerHandle | null;
  private playbackFn: PlaybackHandle | null;

  __wasPlaying = false;

  constructor() {
    // developit/mitt
    this.ee = Object.create(null);
    this.playerFn = null;
    this.playbackFn = null;
  }

  on(state: string, handler: HandlerFn) {
    (this.ee[state] || (this.ee[state] = [])).push(handler);
  }

  off(type: string, handler: HandlerFn) {
    if (this.ee[type]) {
      // eslint-disable-next-line no-bitwise
      this.ee[type].splice(this.ee[type].indexOf(handler) >>> 0, 1);
    }
  }

  emit(type: string, ...evt: unknown[]) {
    (this.ee[type] || []).slice().forEach((handler) => {
      handler(...evt);
    });
  }

  // Sometimes the player is not ready when #playByExternalId
  // is called. We queue it to do so later
  playingExternalId: string | null = null;
  private __queuedPlayingExternalId: undefined | null | string = undefined;

  registerPlayer(registerHandle: PlayerHandle) {
    this.playerFn = registerHandle;
    if (this.__queuedPlayingExternalId !== undefined) {
      registerHandle.playByExternalId(this.__queuedPlayingExternalId);
      this.__queuedPlayingExternalId === undefined;
    }
  }

  registerPlaybackHandle(registerHandle: PlaybackHandle) {
    this.playbackFn = registerHandle;
  }

  unregisterPlaybackHandle() {
    this.playbackFn = null;
  }

  playByExternalId(externalId: string | null) {
    if (!this.playerFn) {
      this.__queuedPlayingExternalId = externalId;
    }
    this.playerFn?.playByExternalId(externalId);
    this.playingExternalId = externalId;
  }

  unregisterPlayer() {
    this.playerFn = null;
  }

  playContext(currentContextSelector: PlaybackCurrentContext | null) {
    this.emit("context", currentContextSelector);
  }

  seek(ms: number) {
    this.playerFn?.seek(ms);
  }

  get isPlaying() {
    return this.playerFn?.isPlaying();
  }

  play() {
    this.emit("play");
    this.__wasPlaying = true;
    this.playerFn?.play();
  }

  pause() {
    this.emit("pause");
    this.__wasPlaying = false;
    this.playerFn?.pause();
  }

  setVolume(percentage: number) {
    this.playerFn?.setVolume(percentage);
  }

  skipForward() {
    this.playbackFn?.skipForward();
  }

  skipBackward() {
    this.playbackFn?.skipBackward();
  }

  playNext(uids: string[]) {
    this.playbackFn?.playNext(uids);
  }
  queuePlayUid(uid: string) {
    this.playbackFn?.queuePlayUid(uid);
  }

  queueReorder(from: number, to: number) {
    this.playbackFn?.queueReorder(from, to);
  }

  queueRemove(uids: string[]) {
    this.playbackFn?.queueRemove(uids);
  }
  queueAdd(trackIds: string[]) {
    this.playbackFn?.queueAdd(trackIds);
  }
}

export default Player;
