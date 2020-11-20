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
} from "~/graphql/gql.gen";
import { TrackDocument } from "~/graphql/gql.gen";
import { QueuePermission } from "./types";
import { SvgBookOpen, SvgGripVertical } from "~/assets/svg/index";
import QueueAddedBy from "./QueueAddedBy";
import { useI18n } from "~/i18n/index";

const QueueDraggableItem: React.FC<{
  removable: boolean;
  provided: DraggableProvided;
  index: number;
  isDragging?: boolean;
  queue: Queue;
  style?: Partial<React.CSSProperties>;
}> = ({ removable, provided, isDragging, queue, index, style }) => {
  const { t } = useI18n();

  const toasts = useToasts();
  const urqlClient = useClient();
  const [, updateQueue] = useUpdateQueueMutation();
  const removeItem = useCallback(async () => {
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
      toasts.success(
        t("queue.manager.removedTrackText", { title: deletingTrackName })
      );
  }, [t, queue, toasts, updateQueue, urqlClient, index]);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...style,
      }}
      className={`select-none flex p-2 items-center ${
        isDragging ? "opacity-75" : ""
      }`}
    >
      <div
        className="focus:outline-none hover:text-foreground-secondary focus:text-foreground-secondary mr-1"
        {...provided.dragHandleProps}
      >
        <SvgGripVertical />
      </div>
      <div className="overflow-hidden h-full w-0 flex-1">
        <TrackItem
          id={queue.items[index].trackId}
          extraInfo={<QueueAddedBy userId={queue.items[index].creatorId} />}
          showMenu
        />
      </div>
      <div className="flex content-end items-center ml-2">
        <button
          type="button"
          title={t("queue.manager.removeTrackText")}
          className={`button ${isDragging ? "hidden" : ""} p-0 h-10 w-10`}
          onClick={removeItem}
          disabled={removable}
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
    </div>
  );
};

const Row = React.memo<
  Pick<ListChildComponentProps, "index" | "style"> & {
    data: {
      queue: Queue;
      permission: QueuePermission;
      userId: string | undefined;
    };
  }
>(function Row({ data, index, style }) {
  return (
    <Draggable
      key={data.queue.items[index].id}
      draggableId={data.queue.items[index].id}
      index={index}
      isDragDisabled={!data.permission.canManage}
    >
      {(provided1) => (
        <QueueDraggableItem
          style={style}
          provided={provided1}
          removable={
            data.permission.canManage ||
            Boolean(
              data.userId && data.queue.items[index].creatorId === data.userId
            )
          }
          queue={data.queue}
          index={index}
          isDragging={false}
        />
      )}
    </Draggable>
  );
}, areEqual);

const QueueManager: React.FC<{
  queueId: string;
  permission: QueuePermission;
}> = ({ queueId, permission }) => {
  const { t } = useI18n();

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

  const itemData = useMemo(
    () => ({
      queue,
      permission,
      userId: user?.id,
    }),
    [queue, permission, user]
  );

  if (!queue) return null;

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {!user && (
        <div className="p-1 flex-none">
          <button onClick={showLogin} className="button w-full text-xs p-2">
            {t("queue.manager.authPrompt")}
          </button>
        </div>
      )}
      <div className="w-full h-full">
        {queue.items?.length === 0 && (
          <div className="text-xs text-foreground-secondary p-4 text-center">
            {t("queue.manager.emptyText")}
          </div>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="droppable"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => (
              <QueueDraggableItem
                provided={provided}
                removable={false}
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
                    itemData={itemData}
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
        {permission.canAdd ? null : (
          <p>
            {t("queue.manager.notAllowedText")}{" "}
            <SvgBookOpen
              className="inline bg-background-secondary p-1 rounded-lg"
              width="20"
              height="20"
              title={t("room.rules.title")}
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default QueueManager;
