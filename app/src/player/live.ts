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
import type { PlaybackSelection } from "./types";

export function registerLivePlayback(
  player: Player,
  { id: combinedId }: PlaybackSelection
) {
  const id = combinedId![1];
  const client = player.gqlClient;
  let nowPlaying: NowPlaying | undefined;

  function updateNowPlaying(nextNowPlaying: NowPlaying) {
    nowPlaying = nextNowPlaying;
    player.setStateQueue({
      nextItems: nowPlaying.next,
      item: {
        ...nowPlaying.current,
        // FIXME: omit this type
        __typename: "QueueItem",
      },
    });
  }

  const { unsubscribe: unsubscribeQueryNP } = pipe(
    client.query<NowPlayingQuery, NowPlayingQueryVariables>(
      NowPlayingDocument,
      { id },
      { requestPolicy: "cache-and-network" }
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

  function onEnded() {
    // we dont really care about the result of this call,
    // it is just to force revalidation of the now playing query

    client
      .query<NowPlayingQuery, NowPlayingQueryVariables>(
        NowPlayingDocument,
        { id },
        { requestPolicy: "cache-and-network" }
      )
      .toPromise()
      .catch();
  }
  // we want to refetch to check if nowPlaying has been updated
  // although we already are notified in ws, it is possible that
  // the ws is disconnected on the cache is miss
  player.on("ended", onEnded);

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
    player.off("ended", onPlay);
    unsubscribeSession();
    unsubscribeSessionSubs();
    unsubscribeQueryNPSub();
    unsubscribeQueryNP();
    player.unregisterPlaybackHandle();
  };
}
