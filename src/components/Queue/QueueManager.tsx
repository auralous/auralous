import React, { useCallback } from "react";
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
import { TrackItem } from "~/components/Track/index";
import { useToasts } from "~/components/Toast/index";
import { useLogin } from "~/components/Auth/index";
import useQueue from "./useQueue";
import { useCurrentUser } from "~/hooks/user";
import {
  useUpdateQueueMutation,
  QueueAction,
  TrackQueryVariables,
  TrackQuery,
  Queue,
  useUserQuery,
} from "~/graphql/gql.gen";
import { TrackDocument } from "~/graphql/gql.gen";
import { QueuePermission, QueueRules } from "./types";
import { SvgBookOpen } from "~/assets/svg/index";

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
  const me = useCurrentUser();
  const [, updateQueue] = useUpdateQueueMutation();
  const removeItem = useCallback(
    async (index: number) => {
      if (!queue) return;
      // This should read from cache
      const deletingTrackName = (
        await urqlClient
          .query<TrackQuery, TrackQueryVariables>(TrackDocument, {
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
    permission.canEditOthers || queue.items[index].creatorId === me?.id;
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: queue.items[index].creatorId },
  });

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...style,
      }}
      className={`select-none flex p-2 hover:bg-background-secondary items-center justify-between ${
        isDragging ? "opacity-75" : ""
      }`}
    >
      <div
        className="overflow-hidden h-full flex flex-col justify-center pl-2 flex-1 relative"
        {...provided.dragHandleProps}
      >
        <TrackItem
          id={queue.items[index].trackId}
          extraInfo={
            <span className="ml-1 flex-none">
              Added by{" "}
              <span className="text-foreground font-semibold text-opacity-75">
                {user?.username || ""}
              </span>
            </span>
          }
        />
      </div>
      <button
        type="button"
        title="Remove Track"
        className="absolute top-1 right-1 bg-transparent p-1 opacity-50 hover:opacity-100 transition-opacity duration-200"
        hidden={!canRemove}
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
  return (
    <Draggable
      key={data.queue.items[index].id}
      draggableId={data.queue.items[index].id}
      index={index}
      isDragDisabled={!data.permission.canEditOthers}
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
}> = ({ queueId, permission }) => {
  const user = useCurrentUser();
  const [queue] = useQueue(queueId, { requestPolicy: "cache-and-network" });
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

  const [, showLogin] = useLogin();

  if (!queue) return null;

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {!user && (
        <div className="p-1 flex-none">
          <button onClick={showLogin} className="button w-full text-xs p-2">
            Join to Add Songs and Listen Together
          </button>
        </div>
      )}
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
        {queue.items?.length === 0 && (
          <div className="text-xs text-foreground-secondary p-4 text-center">
            It&apos;s lonely around here... Let&apos;s add a song!
          </div>
        )}
      </div>
      <div className="text-foreground-tertiary text-xs px-2 py-1">
        {permission.canAdd ? null : (
          <p>
            You are not allowed to contribute. See{" "}
            <SvgBookOpen
              className="inline bg-background-secondary p-1 rounded-lg"
              width="20"
              height="20"
              title="Room Rules button"
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default QueueManager;
