import React, { useCallback, useMemo, useState } from "react";
import {
  QueueAction,
  Room,
  RoomState,
  useUpdateQueueMutation,
} from "~/graphql/gql.gen";
import { useCurrentUser } from "~/hooks/user";
import { QueueManager, useQueue } from "../Queue";
import { TrackAdderPlaylist, TrackAdderSearch } from "../Track/TrackAdder";

const RoomQueue: React.FC<{ room: Room; roomState?: RoomState }> = ({
  room,
  roomState,
}) => {
  const [tab, setTab] = useState<"queue" | "song" | "playlist">("queue");
  const user = useCurrentUser();
  const [, updateQueue] = useUpdateQueueMutation();

  const [queue] = useQueue(`room:${room.id}`);

  const addedTracks = useMemo(() => {
    if (!queue) return [];
    return queue.items.map(({ trackId }) => trackId);
  }, [queue]);

  const permission = useMemo(
    () => ({
      canEditOthers: user?.id === room.creator.id,
      canAdd:
        !!user &&
        Boolean(
          room.creator.id === user.id ||
            roomState?.anyoneCanAdd ||
            roomState?.collabs.includes(user.id)
        ),
    }),
    [user, room, roomState]
  );

  const onAddTracks = useCallback(
    (newTrackArray: string[]) => {
      updateQueue({
        id: `room:${room.id}`,
        tracks: newTrackArray,
        action: QueueAction.Add,
      });
    },
    [updateQueue, room]
  );

  return (
    <div className="h-full flex flex-col">
      <div role="tablist" className="flex flex-none">
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
            tab === "queue"
              ? "bg-foreground bg-opacity-25 text-white"
              : "opacity-75"
          }`}
          aria-controls="tabpanel_queue"
          onClick={() => setTab("queue")}
          aria-selected={tab === "queue"}
        >
          Queue
        </button>
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold  ${
            tab === "song"
              ? "bg-foreground bg-opacity-25 text-white"
              : "opacity-75"
          }`}
          aria-controls="tabpanel_song"
          onClick={() => setTab("song")}
          aria-selected={tab === "song"}
        >
          Search
        </button>
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold  ${
            tab === "playlist"
              ? "bg-foreground bg-opacity-25 text-white"
              : "opacity-75"
          }`}
          aria-controls="tabpanel_playlist"
          onClick={() => setTab("playlist")}
          aria-selected={tab === "playlist"}
        >
          Playlist
        </button>
      </div>
      <div
        aria-hidden={tab !== "queue"}
        className={`${tab !== "queue" ? "hidden" : "flex"} flex-col h-full`}
      >
        <QueueManager
          permission={permission}
          rules={{ maxSongs: roomState?.queueMax ?? 0 }}
          queueId={`room:${room.id}`}
        />
      </div>
      <div
        aria-hidden={tab !== "song"}
        className={`${tab !== "song" ? "hidden" : "flex"} flex-col h-full`}
      >
        <TrackAdderSearch callback={onAddTracks} addedTracks={addedTracks} />
      </div>
      <div
        aria-hidden={tab !== "playlist"}
        className={`${tab !== "playlist" ? "hidden" : "flex"} flex-col h-full`}
      >
        <TrackAdderPlaylist callback={onAddTracks} addedTracks={addedTracks} />
      </div>
    </div>
  );
};

export default RoomQueue;
