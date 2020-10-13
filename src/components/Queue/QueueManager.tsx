import React, { useCallback, useMemo } from "react";
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
import { useToasts } from "~/components/Toast/index";
import useQueue from "./useQueue";
import QueueItemUser from "./QueueItemUser";
import { useCurrentUser } from "~/hooks/user";
import {
  useUpdateQueueMutation,
  QueueAction,
  TrackQueryVariables,
  TrackQuery,
  Queue,
} from "~/graphql/gql.gen";
import { QUERY_TRACK } from "~/graphql/track";
import { QueuePermission, QueueRules } from "./types";

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
      className={`select-none flex p-2 border-b-2 border-opacity-25 border-background-secondary items-center justify-between ${
        isDragging ? "opacity-75" : ""
      }`}
    >
      <div
        className="overflow-hidden h-full flex flex-col justify-center pl-2 flex-1 relative"
        {...provided.dragHandleProps}
      >
        <TrackItem id={queue.items[index].trackId} />
      </div>
      <QueueItemUser userId={queue.items[index].creatorId} />
      <button
        type="button"
        title="Remove track"
        className="absolute top-1 right-1 bg-transparent p-1 opacity-50 hover:opacity-100 transition-opacity duration-200"
        disabled={!canRemove}
        onClick={() => canRemove && removeItem(index)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="12"
          height="12"
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
      </button>
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
