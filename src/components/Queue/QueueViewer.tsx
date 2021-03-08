import { SvgAudioAnimated } from "assets/svg";
import { usePlayer } from "components/Player";
import { TrackItem } from "components/Track/index";
import { useQueueQuery } from "gql/gql.gen";
import { memo, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList, ListChildComponentProps } from "react-window";
import { remToPx } from "utils/util";

const GUTTER_SIZE = 5;

const Row = memo<ListChildComponentProps>(function Row({ data, index, style }) {
  const {
    state: { playingQueueItemId },
  } = usePlayer();
  return (
    <button
      className="text-inline-link p-2"
      style={{
        ...style,
        top: (style.top as number) + GUTTER_SIZE,
        height: (style.height as number) - GUTTER_SIZE,
      }}
      key={data.items[index].id}
      onClick={() => data.onClick(data.items[index].id)}
    >
      {playingQueueItemId == data.items[index].id && (
        <SvgAudioAnimated className="w-6 h-6 text-primary opacity-75 fill-current absolute top-5 left-5 pointer-events-none" />
      )}
      <TrackItem id={data.items[index].trackId} />
    </button>
  );
}, areEqual);

const QueueViewer: React.FC<{
  queueId: string;
  onClick?: (id: string) => void;
}> = ({ queueId, onClick }) => {
  const [{ data: { queue } = { queue: undefined } }] = useQueueQuery({
    variables: { id: queueId },
  });

  const itemData = useMemo(() => ({ items: queue?.items || [], onClick }), [
    onClick,
    queue,
  ]);

  return (
    <AutoSizer defaultHeight={1} defaultWidth={1}>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={itemData.items.length}
          itemSize={remToPx(4)}
          itemData={itemData}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default QueueViewer;
