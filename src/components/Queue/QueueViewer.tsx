import React, { useMemo } from "react";
import { ListChildComponentProps, areEqual, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import useQueue from "./useQueue";
import { TrackItem } from "~/components/Track/index";
import { QueueItem } from "~/graphql/gql.gen";
import QueueItemUser from "./QueueItemUser";

const Row = React.memo<ListChildComponentProps>(function Row({
  data: items,
  index,
  style,
}) {
  return (
    <>
      <div
        className="p-2 border-b-2 border-opacity-25 border-background-secondary"
        style={style}
        key={items[index].id}
      >
        <TrackItem id={items[index].trackId} />
        <QueueItemUser userId={items[index].creatorId} />
      </div>
    </>
  );
},
areEqual);

const QueueViewer: React.FC<{
  queueId: string;
  reverse?: boolean;
}> = ({ queueId, reverse }) => {
  const [queue] = useQueue(queueId);

  const queueItems = useMemo(() => {
    if (!queue) return [];
    if (!reverse) return queue.items;
    const items: QueueItem[] = [];
    for (let i = queue.items.length - 1; i >= 0; i--) {
      items.push(queue.items[i]);
    }
    return items;
  }, [queue, reverse]);

  return (
    <AutoSizer defaultHeight={1} defaultWidth={1}>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={queueItems.length}
          itemSize={72}
          itemData={queueItems}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default QueueViewer;
