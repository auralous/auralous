import mitt from "mitt";
import { PlaybackCurrentContext } from "./types";

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
  queueToTop(uids: string[]): void;
  queuePlayUid(uid: string): void;
  queueReorder(from: number, to: number): void;
  queueRemove(uids: string[]): void;
  queueAdd(trackIds: string[]): void;
}

type EventsType = {
  context: null | PlaybackCurrentContext;
  play?: void; // Dispatch play
  pause?: void; // Dispatch pause
  playing?: void; // Has played
  paused?: void; // Has paused
  seeked?: void; // Has seeked
  ended?: void; // Has ended
  time: number; // On playback time (ms)
  played_external: string | null; // new external id played
};

class Player {
  private ee = mitt<EventsType>();
  private playerFn: PlayerHandle | null = null;
  private playbackFn: PlaybackHandle | null = null;

  playingExternalId: string | null = null;
  __wasPlaying = false;

  on = this.ee.on.bind(this.ee);
  off = this.ee.off.bind(this.ee);
  emit = this.ee.emit.bind(this.ee);

  registerPlayer(registerHandle: PlayerHandle) {
    this.playerFn = registerHandle;
    if (this.playingExternalId !== undefined) {
      registerHandle.playByExternalId(this.playingExternalId);
    }
  }

  registerPlaybackHandle(registerHandle: PlaybackHandle) {
    this.playbackFn = registerHandle;
  }

  unregisterPlaybackHandle() {
    this.playbackFn = null;
  }

  playByExternalId(externalId: string | null) {
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

  queueToTop(uids: string[]) {
    this.playbackFn?.queueToTop(uids);
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
