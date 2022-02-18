import type {
  Client,
  CrossTracksQuery,
  CrossTracksQueryVariables,
  PlatformName,
} from "@auralous/api";
import { CrossTracksDocument } from "@auralous/api";
import mitt from "mitt";
import { pipe, subscribe } from "wonka";
import { registerLivePlayback } from "./live";
import { registerOnDemand } from "./on-demand";
import type { PlaybackContextProvided, PlaybackCurrentContext } from "./types";

export interface PlayerHandle {
  play: () => void;
  seek: (ms: number) => void;
  isPlaying: () => boolean;
  pause: () => void;
  playByExternalId: (externalId: string | null) => void;
  setVolume: (percentage: number) => void;
}

export interface PlaybackHandle {
  skipForward(): void;
  skipBackward(): void;
  queueToTop(uids: string[]): void;
  queuePlayUid(uid: string): void;
  queueReorder(from: number, to: number): void;
  queueRemove(uids: string[]): void;
  queueAdd(trackIds: string[]): void;
}

type EventsType = {
  play?: void; // Dispatch play
  pause?: void; // Dispatch pause
  playing?: void; // Has played
  paused?: void; // Has paused
  seeked?: void; // Has seeked
  ended?: void; // Has ended
  time: number; // On playback time (ms)
  played_external: string | null; // new external id played
  playback_state: PlaybackContextProvided;
  error: Error | null;
  playing_track_id: null | string; // track that is playing, not neccessarily the actual track id
};

class Player {
  public gqlClient!: Client;

  private ee = mitt<EventsType>();
  private playerFn: PlayerHandle | null = null;
  private playbackFn: PlaybackHandle | null = null;

  private __wasPlaying = false;

  super() {
    // When the player is pausing the music
    // there is a chance there is a nowPlaying update
    // causing sudden continue without user intention
    // we pause right away if this happens
    const pauseIfWasNotPlaying = () => {
      if (!this.__wasPlaying) this.pause();
      else this.play();
    };
    this.on("seeked", pauseIfWasNotPlaying);
    this.on("played_external", pauseIfWasNotPlaying);
  }

  on = this.ee.on.bind(this.ee);
  off = this.ee.off.bind(this.ee);
  emit = this.ee.emit.bind(this.ee);

  /**
   * Third party player register
   */
  registerPlayer(registerHandle: PlayerHandle) {
    this.playerFn = registerHandle;
    if (this.trackId) {
      // upon register, start playing if something was playing
      this.setTrackId(this.trackId);
    }
  }

  unregisterPlayer() {
    this.playerFn = null;
  }

  registerPlayback(registerHandle: PlaybackHandle) {
    this.playbackFn = registerHandle;
  }

  unregisterPlaybackHandle() {
    this.playbackFn = null;
  }

  get isPlaying() {
    return this.playerFn?.isPlaying();
  }

  /**
   * Playback Control
   */

  seek(ms: number) {
    this.playerFn?.seek(ms);
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

  /**
   * State control
   */

  private userPlatform: PlatformName | undefined;
  setPlatform(nextPlatform: PlatformName) {
    if (nextPlatform === this.userPlatform) return;
    this.userPlatform = nextPlatform;
    if (this.trackId) this.setTrackId(this.trackId); // to fetch new track based on platform
  }

  private registerUnsubscribe: (() => void) | undefined;
  commitContext(currentContext: PlaybackCurrentContext | null) {
    this.__wasPlaying = !!currentContext; // if a commit happens, player must want playing
    this.registerUnsubscribe?.();
    if (currentContext) {
      if (currentContext.isLive) {
        this.registerUnsubscribe = registerLivePlayback(this, currentContext);
      } else {
        this.registerUnsubscribe = registerOnDemand(this, currentContext);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playContext(currentContextSelector: PlaybackCurrentContext | null) {
    /* TOBE IMPLEMENTED */
  }

  private trackId: string | null = null;
  private externalTrackId: string | null = null;

  getCurrentPlayback() {
    return {
      trackId: this.trackId,
      externalTrackId: this.externalTrackId,
      platform: this.userPlatform,
    };
  }

  private commitPlayTrackId(trackId: string | null) {
    this.emit("playing_track_id", trackId);
    if (!this.playerFn) return;
    this.externalTrackId = trackId ? trackId.split(":")[1] : null;
    this.playerFn.playByExternalId(this.externalTrackId);
  }

  private crossTrackUnsubscribe: (() => void) | undefined;
  setTrackId(trackId: string | null) {
    const userPlatform = this.userPlatform;
    this.trackId = trackId;
    this.crossTrackUnsubscribe?.();
    if (!userPlatform) return; // dont start playing without userPlatform
    if (!trackId) {
      this.commitPlayTrackId(null);
      return;
    }
    const [trackPlatform] = trackId.split(":");
    if (trackPlatform !== this.userPlatform) {
      // need to fetch a compatible track on another platform
      this.crossTrackUnsubscribe = pipe(
        this.gqlClient.query<CrossTracksQuery, CrossTracksQueryVariables>(
          CrossTracksDocument,
          { id: trackId }
        ),
        subscribe((result) => {
          this.crossTrackUnsubscribe!();
          const preferredExternalTrackId =
            result.data?.crossTracks?.[userPlatform];
          if (preferredExternalTrackId) {
            this.commitPlayTrackId(
              `${this.userPlatform}:${preferredExternalTrackId}`
            );
          } else {
            // TODO: emit error
          }
        })
      ).unsubscribe;
    } else {
      this.commitPlayTrackId(trackId);
    }
  }
}

export default Player;
