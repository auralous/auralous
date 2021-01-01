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
import { toast } from "~/lib/toast";
import useQueue from "./useQueue";
import {
  useUpdateQueueMutation,
  QueueAction,
  TrackQueryVariables,
  TrackQuery,
  Queue,
} from "~/graphql/gql.gen";
import { TrackDocument } from "~/graphql/gql.gen";
import { SvgGripVertical } from "~/assets/svg/index";
import QueueAddedBy from "./QueueAddedBy";
import { useI18n } from "~/i18n/index";

const QueueDraggableItem: React.FC<{
  isQueueable: boolean;
  provided: DraggableProvided;
  index: number;
  isDragging?: boolean;
  queue: Queue;
  style?: Partial<React.CSSProperties>;
}> = ({ isQueueable, provided, isDragging, queue, index, style }) => {
  const { t } = useI18n();

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
      toast.success(
        t("queue.manager.removeSuccess", { title: deletingTrackName })
      );
  }, [t, queue, updateQueue, urqlClient, index]);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...style,
      }}
      className={`select-none flex px-2 items-center ${
        isDragging ? "opacity-75" : ""
      }`}
    >
      <div
        className="text-inline-link mr-1"
        {...provided.dragHandleProps}
        hidden={!isQueueable}
      >
        <SvgGripVertical />
      </div>
      <div className="px-2 flex items-center overflow-hidden h-full w-0 flex-1">
        <TrackItem
          id={queue.items[index].trackId}
          extraInfo={<QueueAddedBy userId={queue.items[index].creatorId} />}
        />
      </div>
      <div className="flex content-end items-center ml-2">
        {isQueueable && (
          <button
            title={t("queue.manager.remove")}
            className="btn btn-transparent p-0 h-10 w-10"
            onClick={removeItem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              className="stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={8}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

const Row = React.memo<
  Pick<ListChildComponentProps, "index" | "style"> & {
    data: {
      queue: Queue;
      isQueueable: boolean;
    };
  }
>(function Row({ data, index, style }) {
  return (
    <Draggable
      key={data.queue.items[index].id}
      draggableId={data.queue.items[index].id}
      index={index}
    >
      {(provided1) => (
        <QueueDraggableItem
          style={style}
          provided={provided1}
          isQueueable={data.isQueueable}
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
  isQueueable: boolean;
  onEmptyAddClick?: () => void;
}> = ({ queueId, isQueueable, onEmptyAddClick }) => {
  const { t } = useI18n();

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

  const itemData = useMemo(
    () => ({
      queue,
      isQueueable,
    }),
    [queue, isQueueable]
  );

  if (!queue) return null;

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="w-full h-full">
        {queue.items?.length === 0 && (
          <div className="absolute-center z-10 w-full text-center text-lg text-foreground-tertiary p-4">
            <p className="text-center">{t("queue.manager.empty")}</p>
            {isQueueable && (
              <button
                onClick={onEmptyAddClick}
                className="py-2 px-4 rounded-lg text-primary hover:bg-primary hover:bg-opacity-10 transition-colors font-bold mt-1"
              >
                {t("queue.manager.add")}
              </button>
            )}
          </div>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="droppable"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => (
              <QueueDraggableItem
                provided={provided}
                isQueueable={true}
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
                    itemSize={64}
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
    </div>
  );
};

export default QueueManager;
