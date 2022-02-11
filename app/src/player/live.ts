import type {
  NowPlaying,
  NowPlayingPlayUidMutation,
  NowPlayingPlayUidMutationVariables,
  NowPlayingQuery,
  NowPlayingQueryVariables,
  NowPlayingSkipMutation,
  NowPlayingSkipMutationVariables,
  OnNowPlayingUpdatedSubscription,
  OnNowPlayingUpdatedSubscriptionVariables,
  QueueAddMutation,
  QueueAddMutationVariables,
  QueueRemoveMutation,
  QueueRemoveMutationVariables,
  QueueReorderMutation,
  QueueReorderMutationVariables,
  QueueToTopMutation,
  QueueToTopMutationVariables,
  SessionQuery,
  SessionQueryVariables,
  SessionUpdatedSubscription,
  SessionUpdatedSubscriptionVariables,
} from "@auralous/api";
import {
  NowPlayingDocument,
  NowPlayingPlayUidDocument,
  NowPlayingSkipDocument,
  OnNowPlayingUpdatedDocument,
  QueueAddDocument,
  QueueRemoveDocument,
  QueueReorderDocument,
  QueueToTopDocument,
  SessionDocument,
  SessionUpdatedDocument,
} from "@auralous/api";
import { pipe, subscribe } from "wonka";
import type Player from "./Player";
import type { PlaybackHandle } from "./Player";
import type { PlaybackCurrentContext } from "./types";

export function registerLivePlayback(
  player: Player,
  { id: combinedId }: PlaybackCurrentContext
) {
  const id = combinedId![1];
  const client = player.gqlClient;
  let nowPlaying: NowPlaying | undefined;

  let lastPlayingUid: string | undefined;

  function updateNowPlaying(nextNowPlaying: NowPlaying) {
    nowPlaying = nextNowPlaying;
    player.emit("playback_state", {
      fetching: false,
      nextItems: nowPlaying.next,
      queuePlayingUid: nowPlaying.current.uid,
      trackId: nowPlaying.current.trackId,
    });
    if (lastPlayingUid !== nowPlaying.current.uid) {
      player.setTrackId(nowPlaying.current.trackId);
      lastPlayingUid = nowPlaying.current.uid;
    }
  }

  const { unsubscribe: unsubscribeQueryNP } = pipe(
    client.query<NowPlayingQuery, NowPlayingQueryVariables>(
      NowPlayingDocument,
      { id }
    ),
    subscribe((result) => {
      if (result.data?.nowPlaying) {
        updateNowPlaying(result.data.nowPlaying);
      }
    })
  );
  const { unsubscribe: unsubscribeQueryNPSub } = pipe(
    client.subscription<
      OnNowPlayingUpdatedSubscription,
      OnNowPlayingUpdatedSubscriptionVariables
    >(OnNowPlayingUpdatedDocument, { id }),
    subscribe((result) => result)
  );

  // setup
  const playbackHandle: PlaybackHandle = {
    queueAdd(tracks) {
      client
        .mutation<QueueAddMutation, QueueAddMutationVariables>(
          QueueAddDocument,
          { id, tracks }
        )
        .toPromise();
    },
    queueRemove(uids) {
      client
        .mutation<QueueRemoveMutation, QueueRemoveMutationVariables>(
          QueueRemoveDocument,
          { id, uids }
        )
        .toPromise();
    },
    queueReorder(from: number, to: number) {
      client
        .mutation<QueueReorderMutation, QueueReorderMutationVariables>(
          QueueReorderDocument,
          { id, position: from, insertPosition: to }
        )
        .toPromise();
    },
    queueToTop(uids) {
      client
        .mutation<QueueToTopMutation, QueueToTopMutationVariables>(
          QueueToTopDocument,
          { id, uids }
        )
        .toPromise();
    },
    skipBackward() {
      client
        .mutation<NowPlayingSkipMutation, NowPlayingSkipMutationVariables>(
          NowPlayingSkipDocument,
          { id, isBackward: true }
        )
        .toPromise();
    },
    skipForward() {
      client
        .mutation<NowPlayingSkipMutation, NowPlayingSkipMutationVariables>(
          NowPlayingSkipDocument,
          { id, isBackward: false }
        )
        .toPromise();
    },
    queuePlayUid(uid) {
      client
        .mutation<
          NowPlayingPlayUidMutation,
          NowPlayingPlayUidMutationVariables
        >(NowPlayingPlayUidDocument, { id, uid })
        .toPromise();
    },
  };

  player.registerPlayback(playbackHandle);

  let waitPlayTimeout: ReturnType<typeof setTimeout>;
  function onPlay() {
    clearTimeout(waitPlayTimeout);
    if (!nowPlaying) return;

    // Resume to current live position
    // Delay a bit for player to load
    waitPlayTimeout = setTimeout(() => {
      if (!nowPlaying) return;
      player.seek(Date.now() - nowPlaying.current.playedAt.getTime());
    }, 1000);
  }
  // when the playback starts playing again
  // sync to the current nowPlaying position
  player.on("play", onPlay);

  // session-specific
  // check when session goes offline
  const { unsubscribe: unsubscribeSession } = pipe(
    client.query<SessionQuery, SessionQueryVariables>(SessionDocument, { id }),
    subscribe(({ data }) => {
      if (!data?.session) {
        // invalid state session not defined
        player.playContext(null);
        return;
      }
      if (data.session.isLive === false) {
        player.playContext(null);
      }
    })
  );
  const { unsubscribe: unsubscribeSessionSubs } = pipe(
    client.subscription<
      SessionUpdatedSubscription,
      SessionUpdatedSubscriptionVariables
    >(SessionUpdatedDocument, { id }),
    subscribe((result) => result)
  );

  // cleanup
  return () => {
    clearTimeout(waitPlayTimeout);
    player.off("play", onPlay);
    unsubscribeSession();
    unsubscribeSessionSubs();
    unsubscribeQueryNPSub();
    unsubscribeQueryNP();
    player.unregisterPlaybackHandle();
  };
}
