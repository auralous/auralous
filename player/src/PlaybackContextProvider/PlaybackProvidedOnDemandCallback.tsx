import {
  PlaylistTracksDocument,
  PlaylistTracksQuery,
  PlaylistTracksQueryVariables,
  QueueItem,
  SessionTracksDocument,
  SessionTracksQuery,
  SessionTracksQueryVariables,
  Track,
} from "@auralous/api";
import { FC, useEffect, useMemo, useState } from "react";
import { useClient } from "urql";
import { player } from "../playerSingleton";
import { PlaybackContextProvided, PlaybackCurrentContext } from "../types";
import { reorder, shuffle, uidForIndexedTrack } from "../utils";

/**
 * This component takes over the state of playbackProvided in PlayerProvider
 * if the playback is a "on demand" (non-"live") one
 */
export const PlaybackProvidedOnDemandCallback: FC<{
  playbackContext: PlaybackCurrentContext;
  setPlaybackProvided(value: PlaybackContextProvided | null): void;
}> = ({ playbackContext, setPlaybackProvided }) => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const client = useClient();

  const [playingIndex, setPlayingIndex] = useState(0);

  useEffect(() => {
    let stale = false;
    let trackPromises: Promise<Track[] | null | undefined>;
    if (playbackContext.type === "session") {
      trackPromises = client
        .query<SessionTracksQuery, SessionTracksQueryVariables>(
          SessionTracksDocument,
          { id: playbackContext.id }
        )
        .toPromise()
        .then((result) => result.data?.sessionTracks);
    } else {
      trackPromises = client
        .query<PlaylistTracksQuery, PlaylistTracksQueryVariables>(
          PlaylistTracksDocument,
          { id: playbackContext.id }
        )
        .toPromise()
        .then((result) => result.data?.playlistTracks);
    }
    trackPromises.then((tracks) => {
      if (stale) return;
      if (!tracks) return setQueueItems([]);
      setPlayingIndex(playbackContext.initialIndex ?? 0);
      const queueItems: QueueItem[] = tracks.map((track, index) => ({
        creatorId: "",
        trackId: track.id,
        uid: uidForIndexedTrack(index, track.id),
        __typename: "QueueItem",
      }));
      if (playbackContext.shuffle) {
        shuffle(queueItems);
      }
      setQueueItems(queueItems);
      player.seek(0);
    });
    return () => {
      stale = true;
    };
  }, [playbackContext, client]);

  // TODO: This takes a lot of time
  const nextItems = useMemo(() => {
    return queueItems.slice(playingIndex + 1);
  }, [queueItems, playingIndex]);

  useEffect(() => {
    const skipForward = () => {
      setPlayingIndex((prevPlayingIndex) => {
        if (prevPlayingIndex === queueItems.length - 1) {
          // Edge case: if this is the only queue item, seek to beginning of track
          if (queueItems.length === 0) player.seek(0);
          // reach end of queue, go back to first track
          return 0;
        }
        return prevPlayingIndex + 1;
      });
    };
    const skipBackward = () => {
      setPlayingIndex((prevPlayingIndex) => {
        if (prevPlayingIndex <= 0) {
          // Edge case: if this is the only queue item, seek to beginning of track
          if (queueItems.length === 0) player.seek(0);
          // at first item, go to the last track
          return queueItems.length - 1;
        } else {
          return prevPlayingIndex - 1;
        }
      });
    };

    const queuePlayUid = (uid: string) => {
      const index = queueItems.findIndex((value) => value.uid === uid);
      setPlayingIndex(index);
    };

    const queueRemove = (uids: string[]) => {
      setQueueItems((localQueueItems) =>
        localQueueItems.filter((item) => !uids.includes(item.uid))
      );
    };

    const queueReorder = (from: number, to: number) => {
      // from and to is offsetted depends on currentIndex
      // data is the array of only nextItems,
      // we have to merge it with the played tracks
      setQueueItems((prevQueueItems) =>
        reorder(prevQueueItems, from + playingIndex + 1, to + playingIndex + 1)
      );
    };

    const playNext = (uids: string[]) => {
      setQueueItems((prevQueueItems) => {
        const toTopItems: QueueItem[] = [];
        const afterQueueItems = prevQueueItems
          .slice(playingIndex + 1)
          .filter((item) => {
            if (uids.includes(item.uid)) {
              toTopItems.push(item);
              return false;
            }
            return true;
          });
        return [
          ...prevQueueItems.slice(0, playingIndex + 1),
          ...toTopItems,
          ...afterQueueItems,
        ];
      });
    };

    const queueAdd = (trackIds: string[]) => {
      setQueueItems((prevQueueItems) => [
        ...prevQueueItems,
        ...trackIds.map((trackId) => ({
          uid: Math.random().toString(36).substr(2, 6), // random id
          trackId,
          creatorId: "",
          __typename: "QueueItem" as const,
        })),
      ]);
    };

    player.registerPlaybackHandle({
      skipForward,
      skipBackward,
      queuePlayUid,
      queueRemove,
      queueReorder,
      queueAdd,
      playNext,
    });

    player.on("ended", skipForward);
    return () => {
      player.off("ended", skipForward);
      player.unregisterPlaybackHandle();
    };
  }, [queueItems, playingIndex]);

  useEffect(() => {
    setPlaybackProvided({
      nextItems,
      trackId: queueItems[playingIndex]?.trackId || null,
      fetching: false,
      queuePlayingUid: queueItems[playingIndex]?.uid || null,
    });
  }, [nextItems, queueItems, playingIndex, setPlaybackProvided]);

  useEffect(() => {
    return () => setPlaybackProvided(null);
  }, [setPlaybackProvided]);

  return null;
};
