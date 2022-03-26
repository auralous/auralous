import { conditionalPromiseResolve } from "@/utils/utils";
import type {
  Client,
  CrossTracksQuery,
  CrossTracksQueryVariables,
  PlatformName,
} from "@auralous/api";
import { CrossTracksDocument, MeDocument } from "@auralous/api";
import mitt from "mitt";
import { registerLivePlayback } from "./live";
import { registerOnDemand } from "./on-demand";
import type {
  PlaybackSelection,
  PlaybackStateQueue,
  PlaybackStateSource,
} from "./types";
import { externalTrackIdFromTrackId } from "./utils";

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

  "state-source": PlaybackStateSource;
  "state-queue": PlaybackStateQueue;
};

class Player {
  public gqlClient!: Client;

  private ee = mitt<EventsType>();
  private playerFn: PlayerHandle | null = null;
  private playbackFn: PlaybackHandle | null = null;

  super() {
    // When the player is pausing the music
    // there is a chance there is a nowPlaying update
    // causing sudden continue without user intention
    // we pause right away if this happens
    const pauseIfWasNotPlaying = () => {
      if (!this.state.isPlaying) this.pause();
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
    this.setTrackId(this.state.trackId);
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
    this.state.isPlaying = true;
    this.playerFn?.play();
  }

  pause() {
    this.emit("pause");
    this.state.isPlaying = false;
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
   * 3rd party auth
   */
  retryAuth() {
    return this.gqlClient
      .query(MeDocument, undefined, { requestPolicy: "cache-and-network" }) /// query to force new access token
      .toPromise()
      .then(({ data, error }) => {
        if (!data) return Promise.reject(new Error("authentication error"));
        if (error?.graphQLErrors) return Promise.reject(error.graphQLErrors[0]);
      });
  }

  /**
   * State control
   */
  private state: {
    queue: PlaybackStateQueue;
    source: PlaybackStateSource;
    trackId: string | null;
    loadings: Set<LoadingStateValue>;
    playingPlatform: PlatformName | undefined;
    isPlaying: boolean;
  } = {
    queue: {
      item: null,
      nextItems: [],
    },
    source: {
      trackId: null,
    },
    trackId: null,
    loadings: new Set<LoadingStateValue>(),
    playingPlatform: undefined,
    isPlaying: false,
  };

  getState() {
    return this.state;
  }

  setPlatform(nextPlatform: PlatformName) {
    if (nextPlatform === this.state.playingPlatform) return;
    this.state.playingPlatform = nextPlatform;
    this.setTrackId(this.state.trackId); // to fetch new track based on platform
  }

  private registerUnsubscribe: (() => void) | undefined;
  commitContext(selection: PlaybackSelection | null) {
    this.state.isPlaying = !!selection; // if a commit happens, user must want playing
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

  private setLoading(id: LoadingStateValue, loading: boolean) {
    if (loading) this.state.loadings.add(id);
    else this.state.loadings.delete(id);
    this.emit("loading", Boolean(this.state.loadings.size));
  }

  private commitPlayingTrackId(trackId: string | null) {
    this.state.source = { trackId };
    this.emit("state-source", this.state.source);

    if (!this.playerFn) return;

    this.playerFn.playByExternalId(
      trackId ? externalTrackIdFromTrackId(trackId) : null
    );
  }

  setStateQueue(state: PlaybackStateQueue) {
    this.state.queue = state;
    this.emit("state-queue", this.state.queue);

    if (state.item?.trackId !== this.state.trackId) {
      this.setTrackId(state.item?.trackId || null);
    }
  }

  private setTrackId(trackId: string | null) {
    // cleanup previous state
    this.setLoading("cross_track", false);

    // process
    const playingPlatform = this.state.playingPlatform;
    this.state.trackId = trackId;

    if (!playingPlatform) return; // dont start playing without userPlatform
    if (!trackId) {
      this.commitPlayingTrackId(null);
      return;
    }
    const [trackPlatform] = trackId.split(":");
    if (trackPlatform !== playingPlatform) {
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
        () => variables.id === this.state.trackId,
        {
          onThen: ({ data }) => {
            // another call to setTrackId happens before request finished
            if (variables.id !== this.state.trackId) return;
            const preferredExternalTrackId =
              data?.crossTracks?.[playingPlatform];
            if (preferredExternalTrackId) {
              this.commitPlayingTrackId(
                `${playingPlatform}:${preferredExternalTrackId}`
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
