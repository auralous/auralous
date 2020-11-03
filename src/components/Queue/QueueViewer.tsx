import React, { useMemo, useState } from "react";
import { ListChildComponentProps, areEqual, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import useQueue from "./useQueue";
import { TrackItem } from "~/components/Track/index";
import { SvgPlus } from "~/assets/svg";
import QueueAddedBy from "./QueueAddedBy";

const Row = React.memo<ListChildComponentProps>(function Row({
  data,
  index,
  style,
}) {
  // Only if !!data.onAdd
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <div
        className="p-2 flex items-center justify-between border-b-2 border-opacity-25 border-background-secondary"
        style={style}
        key={data.items[index].id}
      >
        <TrackItem
          id={data.items[index].trackId}
          extraInfo={<QueueAddedBy userId={data.items[index].creatorId} />}
          showMenu
        />
        <div className="flex content-end items-center ml-2">
          {data.onAdd && (
            <button
              type="button"
              aria-label="Add track"
              className={`h-10 px-3 py-2 flex items-center hover:bg-background-secondary ${
                isAdding ? "opacity-50" : ""
              } transition duration-200 rounded-full`}
              onClick={async () => {
                setIsAdding(true);
                await data.onAdd([data.items[index].trackId]);
                setIsAdding(false);
              }}
              disabled={isAdding}
            >
              <SvgPlus width="16" />
            </button>
          )}
        </div>
      </div>
    </>
  );
},
areEqual);

const QueueViewer: React.FC<{
  queueId: string;
  reverse?: boolean;
  onAdd?: (newTrackArray: string[]) => Promise<boolean>;
}> = ({ queueId, reverse, onAdd }) => {
  const [queue] = useQueue(queueId, { requestPolicy: "cache-and-network" });

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
          itemData={{ items, onAdd }}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default QueueViewer;
