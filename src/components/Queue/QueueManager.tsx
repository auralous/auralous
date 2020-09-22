import React, { useState, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
} from "react-beautiful-dnd";
import { useClient } from "urql";
import {
  FixedSizeList as List,
  ListChildComponentProps,
  areEqual,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { TrackItem } from "~/components/Track/TrackItem";
import AddNewTrack from "~/components/Track/AddTrack";
import { useToasts } from "~/components/Toast/index";
import { useModal, Modal } from "~/components/Modal/index";
import useQueue from "./useQueue";
import QueueItemUser from "./QueueItemUser";
import { useCurrentUser } from "~/hooks/user";
import {
  useUpdateQueueMutation,
  QueueAction,
  Track,
  TrackQueryVariables,
  TrackQuery,
  QueryTrackArgs,
  Queue,
} from "~/graphql/gql.gen";
import { QUERY_TRACK } from "~/graphql/track";
import { QueuePermission, QueueRules } from "./types";
import { SvgChevronsLeft, SvgChevronsRight } from "~/assets/svg";

const QueueMenu: React.FC<{
  queue: Queue;
  permission: QueuePermission;
}> = ({ queue, permission }) => {
  const [activeAdd, openAdd, closeAdd] = useModal();
  const [activeClear, openClear, closeClear] = useModal();
  const toasts = useToasts();
  const [, updateQueue] = useUpdateQueueMutation();
  const urqlClient = useClient();

  const addTrackCb = useCallback(
    async (newTrackArray: string[]) => {
      if (!queue) return;
      const { error } = await updateQueue({
        id: queue.id,
        tracks: newTrackArray,
        action: QueueAction.Add,
      });
      let firstTrack: Track | undefined | null;
      if (newTrackArray.length === 1) {
        // We can load the first track as representation
        firstTrack = (
          await urqlClient
            .query<TrackQuery, QueryTrackArgs>(QUERY_TRACK, {
              id: newTrackArray[0],
            })
            .toPromise()
        ).data?.track;
      }
      if (!error)
        toasts.success(
          `Added ${
            firstTrack ? firstTrack.title : `${newTrackArray.length} tracks`
          }`
        );
    },
    [queue, toasts, updateQueue, urqlClient]
  );

  return (
    <>
      <div className="flex items-center my-1">
        <span className="mx-2 text-sm opacity-75 font-bold">Actions</span>
        <button
          type="button"
          className="button button-success rounded-full px-2 py-0 mr-1 font-semibold text-xs"
          onClick={openAdd}
          disabled={!permission.canAdd}
        >
          Add songs
        </button>
        {permission.canEditOthers && (
          <button
            onClick={openClear}
            className="button button-light rounded-full px-2 py-0 mr-1 font-semibold text-xs"
          >
            Clear
          </button>
        )}
      </div>
      <Modal.Modal
        title="Clear queue"
        active={activeClear}
        onOutsideClick={closeClear}
      >
        <Modal.Content>
          Are you sure you want to remove <b>{queue.items.length} tracks</b>{" "}
          from the queue?
        </Modal.Content>
        <Modal.Footer>
          <button
            className="button button-danger"
            onClick={() =>
              updateQueue({
                id: queue.id,
                action: QueueAction.Clear,
              }).then((result) => {
                if (result.error) return;
                toasts.success("Queue cleared");
                closeClear();
              })
            }
          >
            Clear Queue
          </button>
        </Modal.Footer>
      </Modal.Modal>
      <Modal.Modal
        title="Select songs to add"
        active={activeAdd}
        onOutsideClick={closeAdd}
      >
        <Modal.Header>
          <Modal.Title>Select songs</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <AddNewTrack
            addedTracks={queue.items.map(({ trackId }) => trackId)}
            callback={addTrackCb}
          />
        </Modal.Content>
      </Modal.Modal>
    </>
  );
};

const QueueDraggableItem: React.FC<{
  permission: QueuePermission;
  provided: DraggableProvided;
  index: number;
  isDragging?: boolean;
  queue: Queue;
  style?: Partial<React.CSSProperties>;
}> = ({ permission, provided, isDragging, queue, index, style }) => {
  const toasts = useToasts();
  const urqlClient = useClient();
  const user = useCurrentUser();
  const [, updateQueue] = useUpdateQueueMutation();
  const [openSide, setOpenSide] = useState(false);
  const removeItem = useCallback(
    async (index: number) => {
      if (!queue) return;
      // This should read from cache
      const deletingTrackName = (
        await urqlClient
          .query<TrackQuery, TrackQueryVariables>(QUERY_TRACK, {
            id: queue.items[index].trackId,
          })
          .toPromise()
      ).data?.track?.title;
      const { error } = await updateQueue({
        id: queue.id,
        action: QueueAction.Remove,
        position: index,
      });
      if (!error)
        toasts.success(`Removed ${deletingTrackName || "unknown track"}`);
    },
    [queue, toasts, updateQueue, urqlClient]
  );
  const canRemove =
    permission.canEditOthers || queue.items[index].creatorId === user?.id;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...style,
      }}
      className={`select-none rounded-lg flex p-2 mb-2 items-center justify-between ${
        isDragging ? "opacity-75" : ""
      }`}
    >
      <div
        className={`overflow-hidden h-full ${openSide ? "w-16" : "w-0"}`}
        style={{ transition: "width 0.3s ease" }}
      >
        <button
          type="button"
          title="Remove track"
          className="button button-light rounded-none flex-col h-full w-16"
          disabled={!openSide || !canRemove}
          onClick={() => canRemove && removeItem(index)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={8}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-xs">Remove</span>
        </button>
      </div>
      <button
        aria-label="Open queu item menu"
        onClick={() => setOpenSide(!openSide)}
        className={`button p-0 rounded-none h-full ${
          isDragging ? "opacity-0" : ""
        }`}
      >
        {openSide ? (
          <SvgChevronsLeft width="14" height="14" />
        ) : (
          <SvgChevronsRight width="14" height="14" />
        )}
      </button>
      <div
        className="overflow-hidden h-full flex flex-col justify-center pl-2 flex-1 relative"
        {...provided.dragHandleProps}
      >
        <TrackItem id={queue.items[index].trackId} />
      </div>
      <QueueItemUser userId={queue.items[index].creatorId} />
    </div>
  );
};

const Row = React.memo<ListChildComponentProps>(function Row({
  data,
  index,
  style,
}) {
  const user = useCurrentUser();
  const canDrag =
    data.permission.canEditOthers ||
    data.queue.items[index].creatorId === user?.id;
  return (
    <Draggable
      key={data.queue.items[index].id}
      draggableId={data.queue.items[index].id}
      index={index}
      isDragDisabled={!canDrag}
    >
      {(provided1) => (
        <QueueDraggableItem
          style={style}
          provided={provided1}
          permission={data.permission}
          queue={data.queue}
          index={index}
          isDragging={false}
        />
      )}
    </Draggable>
  );
},
areEqual);

const QueueManager: React.FC<{
  queueId: string;
  permission: QueuePermission;
  rules: QueueRules;
}> = ({ queueId, permission, rules }) => {
  const user = useCurrentUser();
  const [queue] = useQueue(queueId);
  const [, updateQueue] = useUpdateQueueMutation();

  const onDragEnd = useCallback(
    async ({ source: origin, destination }: DropResult) => {
      if (!queue) return;
      if (
        !destination ||
        (origin.index === destination.index &&
          origin.droppableId === destination.droppableId)
      ) {
        return;
      }
      await updateQueue({
        id: queue.id,
        action: QueueAction.Reorder,
        position: origin.index,
        insertPosition: destination.index,
      });
    },
    [queue, updateQueue]
  );

  const addedByMe = useMemo(() => {
    let count = 0;
    if (!user || !queue) return count;
    for (const item of queue.items) item.creatorId === user.id && count++;
    return count;
  }, [user, queue]);

  if (!queue) return null;

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <QueueMenu permission={permission} queue={queue} />
      <div className="w-full h-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="droppable"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => (
              <QueueDraggableItem
                provided={provided}
                permission={permission}
                queue={queue}
                index={rubric.source.index}
                isDragging={snapshot.isDragging}
              />
            )}
          >
            {(droppableProvided) => (
              <AutoSizer defaultHeight={1} defaultWidth={1}>
                {({ height, width }) => (
                  <List
                    height={height}
                    width={width}
                    itemCount={queue.items.length}
                    itemSize={72}
                    itemData={{
                      queue,
                      permission,
                    }}
                    outerRef={droppableProvided.innerRef}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="text-foreground-tertiary text-xs px-2 py-1">
        {permission.canAdd ? (
          <>
            {rules.maxSongs > 0 && (
              <p>
                <b
                  className={
                    addedByMe >= rules.maxSongs
                      ? "text-danger-dark"
                      : "text-foreground-secondary"
                  }
                >
                  {addedByMe}
                </b>{" "}
                / <b className="text-foreground-secondary">{rules.maxSongs}</b>{" "}
                songs added by me
              </p>
            )}
          </>
        ) : (
          <p>
            You are not allowed to contribute. See <i>Room Rules</i> to learn
            more.
          </p>
        )}
      </div>
    </div>
  );
};

export default QueueManager;
