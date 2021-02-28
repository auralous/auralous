import { SvgMoreVerticalAlt, SvgPlayListRemove } from "assets/svg/index";
import clsx from "clsx";
import { Button } from "components/Pressable";
import { TrackItem } from "components/Track/index";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  Queue,
  QueueAction,
  useTrackQuery,
  useUpdateQueueMutation,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { memo, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import toast from "react-hot-toast";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  areEqual,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import { remToPx } from "utils/util";
import QueueAddedBy from "./QueueAddedBy";
import useQueue from "./useQueue";

const GUTTER_SIZE = 5;

const QueueDraggableItem: React.FC<{
  isQueueable: boolean;
  provided: DraggableProvided;
  index: number;
  isDragging?: boolean;
  queue: Queue;
  style?: Partial<React.CSSProperties>;
}> = ({ isQueueable, provided, isDragging, queue, index, style }) => {
  const { t } = useI18n();

  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: queue.items[index].trackId },
  });

  const [, updateQueue] = useUpdateQueueMutation();
  const removeItem = useCallback(async () => {
    if (!queue) return;
    const { error } = await updateQueue({
      id: queue.id,
      action: QueueAction.Remove,
      position: index,
    });
    if (!error) {
      toast.success(t("queue.manager.removeSuccess", { title: track?.title }));
    }
  }, [t, queue, updateQueue, track, index]);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        ...(style && {
          ...style,
          top: (style.top as number) + GUTTER_SIZE,
          height: (style.height as number) - GUTTER_SIZE,
        }),
      }}
      className={clsx(
        "select-none flex p-2 items-center",
        isDragging && "opacity-75"
      )}
    >
      <div {...provided.dragHandleProps} hidden={!isQueueable}>
        <Button
          accessibilityLabel={t("queue.manager.move", {
            trackTitle: track?.title,
          })}
          styling="link"
          icon={<SvgMoreVerticalAlt />}
        />
      </div>
      <Box paddingX="sm" row alignItems="center" minWidth={0} flex={1}>
        <TrackItem
          id={queue.items[index].trackId}
          extraInfo={<QueueAddedBy userId={queue.items[index].creatorId} />}
        />
      </Box>
      {isQueueable && (
        <Button
          accessibilityLabel={t("queue.manager.remove", {
            trackTitle: track?.title,
          })}
          styling="link"
          onPress={removeItem}
          icon={<SvgPlayListRemove />}
        />
      )}
    </div>
  );
};

const Row = memo<
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
}> = ({ queueId, isQueueable }) => {
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
    <>
      {queue.items?.length === 0 && (
        <div className="absolute-center z-10 w-full p-4">
          <Typography.Paragraph
            align="center"
            size="lg"
            color="foreground-tertiary"
          >
            {t("queue.manager.empty")}
          </Typography.Paragraph>
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
                  itemSize={remToPx(4)}
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
    </>
  );
};

export default QueueManager;
