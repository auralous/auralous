import {
  useMeQuery,
  useNowPlayingQuery,
  useNowPlayingSkipMutation,
  useOnNowPlayingUpdatedSubscription,
  useQueueAddMutation,
  useQueueQuery,
  useQueueRemoveMutation,
  useQueueReorderMutation,
  useQueueToTopMutation,
  useQueueUpdatedSubscription,
  useStoryPingMutation,
} from "@auralous/api";
import { FC, useEffect } from "react";
import { player } from "../playerSingleton";
import { PlaybackContextProvided, PlaybackCurrentContext } from "../types";

/**
 * This component takes over the state of playbackProvided in PlayerProvider
 * if the playback is a "live" one
 */
export const PlaybackProvidedLiveCallback: FC<{
  playbackContext: PlaybackCurrentContext;
  setPlaybackProvided(value: PlaybackContextProvided | null): void;
}> = ({ playbackContext, setPlaybackProvided }) => {
  const [{ data: { nowPlaying } = { nowPlaying: undefined }, fetching }] =
    useNowPlayingQuery({
      variables: { id: playbackContext.id },
      requestPolicy: "cache-and-network",
    });

  useOnNowPlayingUpdatedSubscription({
    variables: { id: playbackContext.id },
  });

  const [{ data }] = useQueueQuery({
    variables: {
      id: playbackContext.id,
    },
  });

  const queue = data?.queue;

  useQueueUpdatedSubscription({
    variables: { id: queue?.id || "" },
    pause: !queue,
  });

  const [, doQueueRemove] = useQueueRemoveMutation();
  const [, doQueueReorder] = useQueueReorderMutation();
  const [, doQueueToTop] = useQueueToTopMutation();
  const [, doQueueAdd] = useQueueAddMutation();

  useEffect(() => {
    // We hook into `play` event to trigger
    // seeking to live position on resume
    if (!nowPlaying) return undefined;
    let waitPlayTimeout: ReturnType<typeof setTimeout>;
    const onPlay = () => {
      const currentTrack = nowPlaying.currentTrack;
      if (!currentTrack) return;
      // Resume to current live position
      // Delay a bit for player to load
      waitPlayTimeout = setTimeout(() => {
        player.seek(Date.now() - currentTrack.playedAt.getTime());
      }, 1000);
    };

    player.on("play", onPlay);
    return () => {
      clearTimeout(waitPlayTimeout);
      player.off("play", onPlay);
    };
  }, [nowPlaying]);

  const [{ fetching: fetchingSkip }, skipNowPlaying] =
    useNowPlayingSkipMutation();

  useEffect(() => {
    if (!queue) return;
    const id = queue.id;
    const queueReorder = (from: number, to: number) => {
      doQueueReorder({
        id,
        position: from,
        insertPosition: to,
      });
    };
    const queueRemove = (uids: string[]) => {
      doQueueRemove({
        id,
        uids,
      });
    };
    const playNext = (uids: string[]) => {
      doQueueToTop({
        id,
        uids,
      });
    };
    const queueAdd = (trackIds: string[]) => {
      doQueueAdd({
        id,
        tracks: trackIds,
      });
    };
    const skipForward = () => !fetchingSkip && skipNowPlaying({ id: queue.id });
    const skipBackward = () => undefined;
    const queuePlayUid = () => undefined;

    player.registerPlaybackHandle({
      skipForward,
      skipBackward,
      queuePlayUid,
      queueRemove,
      queueReorder,
      queueAdd,
      playNext,
    });

    return () => {
      player.unregisterPlaybackHandle();
    };
  }, [
    queue,
    skipNowPlaying,
    doQueueReorder,
    doQueueRemove,
    doQueueToTop,
    doQueueAdd,
    fetchingSkip,
  ]);

  const [{ data: { me } = { me: undefined } }] = useMeQuery();
  const [, storyPing] = useStoryPingMutation();
  useEffect(() => {
    if (!me) return;
    if (playbackContext.type !== "story") return;
    const pingInterval = setInterval(() => {
      storyPing({ id: playbackContext.id });
    }, 30 * 1000);
    return () => clearInterval(pingInterval);
  }, [playbackContext, me, storyPing]);

  useEffect(() => {
    setPlaybackProvided({
      nextItems: queue?.items || [],
      trackId: nowPlaying?.currentTrack?.trackId || null,
      fetching,
      queuePlayingUid: nowPlaying?.currentTrack?.uid || null,
    });
  }, [queue, nowPlaying?.currentTrack, fetching, setPlaybackProvided]);

  useEffect(() => {
    return () => setPlaybackProvided(null);
  }, [setPlaybackProvided]);

  return null;
};
