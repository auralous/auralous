import { PlayerPlaying } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
type HandlerFn = Function;

interface PlayerHandle {
  play: () => void;
  seek: (ms: number) => void;
  isPlaying: () => boolean;
  pause: () => void;
  playByExternalId: (externalId: string | null) => void;
  setVolume: (p: number) => void;
}

interface Player {
  // on
  on(state: "play", fn: () => void): void; // Trigger play
  on(state: "pause", fn: () => void): void; // Trigger pause
  on(state: "playing", fn: () => void): void; // Actually playing
  on(state: "paused", fn: () => void): void; // Actually pausing
  on(state: "seeked", fn: () => void): void;
  on(state: "ended", fn: () => void): void;
  on(state: "time", fn: (ms: number) => void): void;
  // off
  off(state: "play", fn: () => void): void;
  off(state: "pause", fn: () => void): void;
  off(state: "playing", fn: () => void): void;
  off(state: "paused", fn: () => void): void;
  off(state: "seeked", fn: () => void): void;
  off(state: "ended", fn: () => void): void;
  off(state: "time", fn: (ms: number) => void): void;
}

class Player {
  private ee: Record<string, HandlerFn[]>;
  private playerFn: PlayerHandle | null;
  wasPlaying = false;
  playerPlaying: PlayerPlaying = null;

  constructor() {
    // developit/mitt
    this.ee = Object.create(null);
    this.playerFn = null;
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

  registerPlayer(registerHandle: PlayerHandle) {
    this.playerFn = registerHandle;
    // start playing after register
    this.playerPlaying &&
      registerHandle.playByExternalId(this.playerPlaying.externalId);
  }

  unregisterPlayer() {
    this.playerFn = null;
  }

  seek(ms: number) {
    this.playerFn?.seek(ms);
  }

  get isPlaying() {
    return this.playerFn?.isPlaying();
  }

  play() {
    this.emit("play");
    this.wasPlaying = true;
    this.playerFn?.play();
  }

  pause() {
    this.emit("pause");
    this.wasPlaying = false;
    this.playerFn?.pause();
  }

  setVolume(p: number) {
    this.playerFn?.setVolume(p);
  }

  playByExternalId(externalId: string | null) {
    this.playerFn?.playByExternalId(externalId);
  }
}

export default Player;
