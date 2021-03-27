import { SvgAudioAnimated } from "assets/svg";
import { usePlayer } from "components/Player";
import { IPlayerContext } from "components/Player/types";
import { TrackItem } from "components/Track/index";
import { useQueueQuery } from "gql/gql.gen";
import { memo, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList, ListChildComponentProps } from "react-window";
import { remToPx } from "utils/util";

const GUTTER_SIZE = 5;

const Row = memo<ListChildComponentProps>(function Row({ data, index, style }) {
  const [{ currQueueIndex }] = usePlayer();
  return (
    <button
      className="text-inline-link p-2"
      style={{
        ...style,
        top: (style.top as number) + GUTTER_SIZE,
        height: (style.height as number) - GUTTER_SIZE,
      }}
      // It is okay to use index here because we know it won't change
      key={index}
      onClick={() => data.playQueueItem(index)}
    >
      {currQueueIndex === index && (
        <SvgAudioAnimated className="w-6 h-6 text-primary opacity-75 fill-current absolute top-5 left-5 pointer-events-none" />
      )}
      <TrackItem id={data.items[index].trackId} />
    </button>
  );
}, areEqual);

const QueueViewer: React.FC<{
  queueId: string;
  playQueueItem?: IPlayerContext["1"]["playQueueItem"];
}> = ({ queueId, playQueueItem }) => {
  const [{ data: { queue } = { queue: undefined } }] = useQueueQuery({
    variables: { id: queueId },
  });

  const itemData = useMemo(
    () => ({ items: queue?.items || [], playQueueItem }),
    [playQueueItem, queue]
  );

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
