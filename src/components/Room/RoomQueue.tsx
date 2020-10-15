import React, { useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "~/hooks/user";
import { Modal, useModal } from "~/components/Modal";
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
      return updateQueue({
        id: `room:${room.id}`,
        tracks: newTrackArray,
        action: QueueAction.Add,
      }).then((result) => !!result.data?.updateQueue);
    },
    [updateQueue, room]
  );

  const [activePlayed, openPlayed, closePlayed] = useModal();

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
          <button
            className="text-xs p-1 leading-none button button-light bottom-2 right-2 absolute"
            onClick={openPlayed}
          >
            Recently Played
          </button>
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
          <TrackAdderPlaylist
            callback={onAddTracks}
            addedTracks={addedTracks}
          />
        </div>
      </div>
      <Modal.Modal active={activePlayed} onOutsideClick={closePlayed}>
        <Modal.Header>
          <Modal.Title>Recently Played</Modal.Title>
        </Modal.Header>
        <Modal.Content noPadding>
          <div className="h-128">
            <QueueViewer queueId={`room:${room.id}:played`} reverse />
          </div>
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

export default RoomQueue;
