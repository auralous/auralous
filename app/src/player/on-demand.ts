import type {
  PlaylistTracksQuery,
  PlaylistTracksQueryVariables,
  QueueItem,
  SessionTracksQuery,
  SessionTracksQueryVariables,
  Track,
} from "@auralous/api";
import { PlaylistTracksDocument, SessionTracksDocument } from "@auralous/api";
import type Player from "./Player";
import type { PlaybackHandle } from "./Player";
import type { PlaybackCurrentContext } from "./types";
import { reorder, shuffle, uidForIndexedTrack } from "./utils";

export function registerOnDemand(
  player: Player,
  playbackContext: PlaybackCurrentContext
) {
  const {
    id: combinedId,
    initialTracks,
    initialIndex,
    shuffle: isShuffle,
  } = playbackContext;

  let queue: QueueItem[] = [];
  let playingIndex = initialIndex || 0;

  function updateState() {
    const nextItems = queue.slice(playingIndex + 1);
    const currItem = queue[playingIndex];
    player.setPlaybackState({
      nextItems,
      trackId: currItem.trackId,
      queuePlayingUid: currItem.uid,
    });
  }

  function playByIndex(index: number) {
    if (index < 0) {
      throw new Error("registerOnDemand: invalid index");
    }
    playingIndex = index;
    updateState();
  }

  function setQueue(newQueue: QueueItem[]) {
    const shouldPlay = queue[playingIndex]?.uid !== newQueue[playingIndex].uid;
    queue = newQueue;
    if (shouldPlay) playByIndex(playingIndex);
    else updateState();
  }

  // setup
  const playbackHandle: PlaybackHandle = {
    queueAdd(trackIds) {
      setQueue([
        ...queue,
        ...trackIds.map((trackId, index) => ({
          uid: uidForIndexedTrack(queue.length + index, trackId),
          trackId,
          creatorId: "",
          __typename: "QueueItem" as const,
        })),
      ]);
    },
    queueRemove(uids) {
      setQueue(queue.filter((item) => !uids.includes(item.uid)));
    },
    queueReorder(from: number, to: number) {
      setQueue(reorder(queue, from + playingIndex + 1, to + playingIndex + 1));
    },
    queueToTop(uids) {
      const toTopItems: QueueItem[] = [];
      const afterQueueItems = queue.slice(playingIndex + 1).filter((item) => {
        if (uids.includes(item.uid)) {
          toTopItems.push(item);
          return false;
        }
        return true;
      });
      setQueue([
        ...queue.slice(0, playingIndex + 1),
        ...toTopItems,
        ...afterQueueItems,
      ]);
    },
    skipBackward() {
      if (playingIndex <= 0) {
        // Edge case: if this is the only queue item, seek to beginning of track
        if (queue.length === 0) player.seek(0);
        // at first item, go to the last track
        playByIndex(queue.length - 1);
      } else {
        playByIndex(playingIndex - 1);
      }
    },
    skipForward() {
      if (playingIndex >= queue.length - 1) {
        // Edge case: if this is the only queue item, seek to beginning of track
        if (queue.length === 0) player.seek(0);
        // reach end of queue, go back to first track
        playByIndex(0);
      } else {
        playByIndex(playingIndex + 1);
      }
    },
    queuePlayUid(uid) {
      playByIndex(queue.findIndex((value) => value.uid === uid));
    },
  };
  player.registerPlayback(playbackHandle);
  player.on("ended", playbackHandle.skipForward);

  let fetchTracksStale = false;
  if (initialTracks) {
    const cloned = [...initialTracks];
    playbackHandle.queueAdd(isShuffle ? shuffle(cloned) : cloned);
  } else if (combinedId) {
    const setByTracks = (tracks: Track[]) => {
      if (fetchTracksStale) return;
      if (isShuffle) tracks = shuffle([...tracks]);
      playbackHandle.queueAdd(tracks.map((track) => track.id));
    };
    if (combinedId[0] === "playlist") {
      player.gqlClient
        .query<PlaylistTracksQuery, PlaylistTracksQueryVariables>(
          PlaylistTracksDocument,
          { id: combinedId[1] }
        )
        .toPromise()
        .then(({ data }) => setByTracks(data?.playlistTracks || []));
    } else if (combinedId[0] === "session") {
      player.gqlClient
        .query<SessionTracksQuery, SessionTracksQueryVariables>(
          SessionTracksDocument,
          { id: combinedId[1] }
        )
        .toPromise()
        .then(({ data }) => setByTracks(data?.sessionTracks || []));
    }
  }

  // cleanup
  return () => {
    fetchTracksStale = true;
    player.off("ended", playbackHandle.skipForward);
    player.unregisterPlaybackHandle();
  };
}
