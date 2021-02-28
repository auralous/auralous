import { SvgPlayListAdd, SvgPlayListCheck } from "assets/svg";
import { Button } from "components/Pressable";
import { TrackItem } from "components/Track/index";
import { Box } from "components/View";
import { useI18n } from "i18n/index";
import { memo, useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { areEqual, FixedSizeList, ListChildComponentProps } from "react-window";
import { remToPx } from "utils/util";
import { TrackAdderCallbackFn } from "./types";

const GUTTER_SIZE = 5;

const SearchResultRow = memo<ListChildComponentProps>(function Row({
  data,
  index,
  style,
}) {
  const { t } = useI18n();

  const added = useMemo(() => data.addedTracks.includes(data.items[index]), [
    data,
    index,
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const onAdded = () => {
    if (added && !window.confirm(t("track.adder.result.confirmAdded"))) return;
    setIsAdding(true);
    data.callback([data.items[index]]).then(() => setIsAdding(false));
  };

  return (
    <Box
      row
      padding="sm"
      alignItems="center"
      justifyContent="between"
      accessibilityRole="presentation"
      key={data.items[index]}
      style={{
        ...style,
        top: (style.top as number) + GUTTER_SIZE,
        height: (style.height as number) - GUTTER_SIZE,
      }}
      gap="sm"
    >
      <Box flex={1} minWidth={0}>
        <TrackItem id={data.items[index]} />
      </Box>
      <Button
        accessibilityLabel={t("queue.manager.add")}
        icon={added ? <SvgPlayListCheck /> : <SvgPlayListAdd />}
        onPress={onAdded}
        disabled={isAdding}
      />
    </Box>
  );
},
areEqual);

const TrackAdderResults: React.FC<{
  results: string[];
  callback: TrackAdderCallbackFn;
  addedTracks: string[];
}> = ({ callback, results, addedTracks }) => {
  // TODO: a11y
  return (
    <div
      role="listbox"
      className="overflow-hidden flex-1 min-h-0 flex flex-col"
    >
      <AutoSizer defaultHeight={1} defaultWidth={1}>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={results.length}
            itemSize={remToPx(4)}
            itemData={{ items: results, callback, addedTracks }}
          >
            {SearchResultRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

export default TrackAdderResults;
