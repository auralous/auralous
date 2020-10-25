import React, { useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "~/hooks/user";
import { QueueManager, QueueViewer, useQueue } from "~/components/Queue";
import {
  TrackAdderPlaylist,
  TrackAdderSearch,
} from "~/components/Track/TrackAdder";
import {
  QueueAction,
  Room,
  RoomState,
  useUpdateQueueMutation,
} from "~/graphql/gql.gen";
import { SvgClock } from "~/assets/svg";

const RoomQueue: React.FC<{ room: Room; roomState?: RoomState }> = ({
  room,
  roomState,
}) => {
  const [tab, setTab] = useState<"queue" | "song" | "playlist" | "played">(
    "queue"
  );
  const user = useCurrentUser();
  const [, updateQueue] = useUpdateQueueMutation();

  const [queue] = useQueue(`room:${room.id}`);

  const addedTracks = useMemo(() => {
    if (!queue) return [];
    return queue.items.map(({ trackId }) => trackId);
  }, [queue]);

  const permission = useMemo(
    () => ({
      canEditOthers: user?.id === room.creatorId,
      canAdd:
        !!user &&
        Boolean(
          room.creatorId === user.id ||
            roomState?.anyoneCanAdd ||
            roomState?.collabs.includes(user.id)
        ),
    }),
    [user, room, roomState]
  );

  const onAddTracks = useCallback(
    (newTrackArray: string[]) => {
      return updateQueue({
        id: `room:${room.id}`,
        tracks: newTrackArray,
        action: QueueAction.Add,
      }).then((result) => !!result.data?.updateQueue);
    },
    [updateQueue, room]
  );

  return (
    <>
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
            disabled={!permission.canAdd}
          >
            Search
          </button>
          <button
            role="tab"
            className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
              tab === "playlist"
                ? "bg-foreground bg-opacity-25 text-white"
                : "opacity-75"
            }`}
            aria-controls="tabpanel_playlist"
            onClick={() => setTab("playlist")}
            aria-selected={tab === "playlist"}
            disabled={!permission.canAdd}
          >
            Playlist
          </button>
          <button
            role="tab"
            className={`flex-none mx-1 p-1 text-sm rounded-lg font-bold ${
              tab === "played"
                ? "bg-foreground bg-opacity-25 text-white"
                : "opacity-75"
            }`}
            title="Recently Played"
            aria-controls="tabpanel_played"
            onClick={() => setTab("played")}
            aria-selected={tab === "played"}
          >
            <SvgClock width="16" height="16" />
          </button>
        </div>
        <div
          aria-hidden={tab !== "queue"}
          className={`${
            tab !== "queue" ? "hidden" : "flex"
          } relative flex-col h-full`}
        >
          <QueueManager
            permission={permission}
            rules={{}}
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
          className={`${
            tab !== "playlist" ? "hidden" : "flex"
          } flex-col h-full overflow-hidden`}
        >
          {
            /* We do not render playlist to avoid prefetch of playlists */
            tab === "playlist" && (
              <TrackAdderPlaylist
                callback={onAddTracks}
                addedTracks={addedTracks}
              />
            )
          }
        </div>
        <div
          aria-hidden={tab !== "played"}
          className={`${
            tab !== "played" ? "hidden" : "flex"
          } flex-col h-full overflow-hidden`}
        >
          <QueueViewer
            onAdd={onAddTracks}
            queueId={`room:${room.id}:played`}
            reverse
          />
        </div>
      </div>
    </>
  );
};

export default RoomQueue;
