import { conditionalPromiseResolve } from "@/utils/utils";
import type {
  Client,
  CrossTracksQuery,
  CrossTracksQueryVariables,
  PlatformName,
} from "@auralous/api";
import { CrossTracksDocument } from "@auralous/api";
import mitt from "mitt";
import { registerLivePlayback } from "./live";
import { registerOnDemand } from "./on-demand";
import type {
  PlaybackSelection,
  PlaybackStateQueue,
  PlaybackStateSource,
} from "./types";

export type LoadingStateValue = "cross_track";

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
  loading: boolean;
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
    // upon register, start playing if something was playing
    this.setTrackId(this.trackId);
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
    this.setTrackId(this.trackId); // to fetch new track based on platform
  }

  private registerUnsubscribe: (() => void) | undefined;
  commitContext(selection: PlaybackSelection | null) {
    this.__wasPlaying = !!selection; // if a commit happens, user must want playing
    this.registerUnsubscribe?.();
    if (selection) {
      if (selection.isLive) {
        this.registerUnsubscribe = registerLivePlayback(this, selection);
      } else {
        this.registerUnsubscribe = registerOnDemand(this, selection);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playContext(currentContextSelector: PlaybackSelection | null) {
    /* TOBE IMPLEMENTED */
  }

  private loadingState = new Set<LoadingStateValue>();
  setLoading(id: LoadingStateValue, loading: boolean) {
    if (loading) this.loadingState.add(id);
    else this.loadingState.delete(id);
    this.emit("loading", Boolean(this.loadingState.size));
  }

  private trackId: string | null = null;
  private externalTrackId: string | null = null;
  private playingTrackId: string | null = null;

  getCurrentPlayback() {
    return {
      trackId: this.trackId,
      playingTrackId: this.playingTrackId,
      externalTrackId: this.externalTrackId,
      platform: this.userPlatform,
    };
  }

  public setReactPlaybackStateSource?: (source: PlaybackStateSource) => void;
  private commitPlayingTrackId(trackId: string | null) {
    this.setReactPlaybackStateSource?.({ trackId });

    if (!this.playerFn) return;

    this.externalTrackId = trackId ? trackId.split(":")[1] : null;
    this.playerFn.playByExternalId(this.externalTrackId);
  }

  public setReactPlaybackStateQueue?: (state: PlaybackStateQueue) => void;
  setStateQueue(state: PlaybackStateQueue) {
    this.setReactPlaybackStateQueue?.(state);
    if (state.item?.trackId !== this.trackId) {
      this.setTrackId(state.item?.trackId || null);
    }
  }

  private setTrackId(trackId: string | null) {
    // cleanup previous state
    this.setLoading("cross_track", false);

    // process
    const userPlatform = this.userPlatform;
    this.trackId = trackId;

    if (!userPlatform) return; // dont start playing without userPlatform
    if (!trackId) {
      this.commitPlayingTrackId(null);
      return;
    }
    const [trackPlatform] = trackId.split(":");
    if (trackPlatform !== this.userPlatform) {
      // temporarily stop external player playback
      this.commitPlayingTrackId(null);

      // need to fetch a compatible track on another platform

      const variables = { id: trackId };
      this.setLoading("cross_track", true);
      conditionalPromiseResolve(
        this.gqlClient
          .query<CrossTracksQuery, CrossTracksQueryVariables>(
            CrossTracksDocument,
            variables
          )
          .toPromise(),
        () => variables.id === this.trackId,
        {
          onThen: ({ data }) => {
            // another call to setTrackId happens before request finished
            if (variables.id !== this.trackId) return;
            const preferredExternalTrackId = data?.crossTracks?.[userPlatform];
            if (preferredExternalTrackId) {
              this.commitPlayingTrackId(
                `${this.userPlatform}:${preferredExternalTrackId}`
              );
            } else {
              // TODO: emit error
            }
          },
          onFinally: () => {
            this.setLoading("cross_track", false);
          },
        }
      );
    } else {
      this.commitPlayingTrackId(trackId);
    }
  }
}

export default Player;
