import React, { useMemo, useState } from "react";
import { ListChildComponentProps, areEqual, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { UseQueryArgs } from "urql";
import useQueue from "./useQueue";
import { TrackItem } from "~/components/Track/index";
import { SvgPlus } from "~/assets/svg";
import QueueAddedBy from "./QueueAddedBy";
import { useI18n } from "~/i18n/index";

const Row = React.memo<ListChildComponentProps>(function Row({
  data,
  index,
  style,
}) {
  const { t } = useI18n();

  // Only if !!data.onAdd
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <div
        className="p-2 flex items-center justify-between"
        style={style}
        key={data.items[index].id}
      >
        <TrackItem
          id={data.items[index].trackId}
          extraInfo={<QueueAddedBy userId={data.items[index].creatorId} />}
        />
        <div className="flex content-end items-center ml-2">
          {data.onAdd && (
            <button
              aria-label={t("queue.manager.addAction")}
              className="btn p-0 h-10 w-10"
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
  queryOpts?: Partial<
    UseQueryArgs<{
      id: string;
    }>
  >;
}> = ({ queueId, reverse, onAdd, queryOpts }) => {
  const [queue] = useQueue(queueId, {
    requestPolicy: "cache-and-network",
    ...queryOpts,
  });

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
