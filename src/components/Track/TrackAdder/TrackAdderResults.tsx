import React, { useMemo, useState } from "react";
import { ListChildComponentProps, areEqual, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { TrackItem } from "~/components/Track/index";
import { useI18n } from "~/i18n/index";
import { SvgCheck, SvgPlus } from "~/assets/svg";
import { TrackAdderCallbackFn } from "./types";

const SearchResultRow = React.memo<ListChildComponentProps>(function Row({
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

  return (
    <div
      className="px-2 flex items-center justify-between"
      role="presentation"
      key={data.items[index]}
      style={style}
    >
      <TrackItem id={data.items[index]} />
      <div className="flex content-end items-center ml-2">
        <button
          aria-label={t("queue.manager.addAction")}
          className="btn p-0 h-10 w-10"
          onClick={async () => {
            if (added && !window.confirm(t("track.adder.result.confirmAdded")))
              return;
            setIsAdding(true);
            await data.callback([data.items[index]]);
            setIsAdding(false);
          }}
          disabled={isAdding}
        >
          {added ? (
            <SvgCheck className="text-success-light" width="18" />
          ) : (
            <SvgPlus width="16" />
          )}
        </button>
      </div>
    </div>
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
    <div role="listbox" className="overflow-hidden flex-1 h-0 flex flex-col">
      <AutoSizer defaultHeight={1} defaultWidth={1}>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={results.length}
            itemSize={64}
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
