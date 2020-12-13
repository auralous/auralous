import React, { useMemo } from "react";
import { ListChildComponentProps, areEqual, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import useQueue from "./useQueue";
import { TrackItem } from "~/components/Track/index";
import QueueAddedBy from "./QueueAddedBy";

const Row = React.memo<ListChildComponentProps>(function Row({
  data: items,
  index,
  style,
}) {
  return (
    <>
      <div
        className="p-2 flex items-center justify-between"
        style={style}
        key={items[index].id}
      >
        <TrackItem
          id={items[index].trackId}
          extraInfo={<QueueAddedBy userId={items[index].creatorId} />}
        />
      </div>
    </>
  );
},
areEqual);

const QueueViewer: React.FC<{
  queueId: string;
  reverse?: boolean;
}> = ({ queueId, reverse }) => {
  const [queue] = useQueue(queueId, true);

  const items = useMemo(() => {
    if (!queue) return [];
    if (!reverse) return queue.items;
    return [...queue.items].reverse();
  }, [queue, reverse]);

  return (
    <AutoSizer defaultHeight={1} defaultWidth={1}>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={72}
          itemData={items}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default QueueViewer;
