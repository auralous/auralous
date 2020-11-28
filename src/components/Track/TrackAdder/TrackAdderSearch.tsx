import React, { useCallback, useRef, useState } from "react";
import { useClient } from "urql";
import { useMAuth } from "~/hooks/user";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { PlatformName, Track, SearchTrackDocument } from "~/graphql/gql.gen";
import { useI18n } from "~/i18n/index";
import { TrackAdderCallbackFn } from "./types";
import { SvgX } from "~/assets/svg";

const TrackAdderSearch: React.FC<{
  callback: TrackAdderCallbackFn;
  addedTracks: string[];
  platform?: PlatformName;
}> = ({ addedTracks, callback }) => {
  const { t } = useI18n();

  const formRef = useRef<HTMLFormElement>(null);
  const { data: mAuth } = useMAuth();
  const platform = mAuth?.platform || PlatformName.Youtube;
  const urqlClient = useClient();
  const [queryResults, setQueryResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = event.currentTarget.search.value.trim();
      if (!query || isSearching) return;
      setIsEmpty(false);
      setIsSearching(true);
      urqlClient
        .query(SearchTrackDocument, { platform, query })
        .toPromise()
        .then((response) => {
          setQueryResults(response.data.searchTrack || []);
          setIsSearching(false);
        });
    },
    [urqlClient, isSearching, platform]
  );

  return (
    <div className="h-full w-full flex flex-col">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="p-2"
        autoComplete="off"
      >
        <div className="relative w-full">
          <input
            className="input w-full h-10"
            type="text"
            name="search"
            aria-label={t("track.adder.search.title")}
            placeholder={t("track.adder.search.placeholder")}
            required
          />
          <button
            title="Remove search results"
            type="button"
            className="absolute-center left-auto right-0"
            onClick={() => {
              formRef.current?.reset();
              setIsEmpty(true);
              setQueryResults([]);
            }}
            hidden={isEmpty}
          >
            <SvgX />
          </button>
        </div>
      </form>
      {(isEmpty || isSearching) && (
        <div className="p-2 flex flex-col text-lg text-center flex-center w-full h-full text-foreground-secondary">
          {isSearching && (
            <b className="animate-pulse">{t("track.adder.search.loading")}</b>
          )}
          {isEmpty && t("track.adder.search.helpText")}
        </div>
      )}
      <TrackAdderResults
        addedTracks={addedTracks}
        callback={callback}
        results={queryResults.map(({ id }) => id)}
      />
    </div>
  );
};

export default TrackAdderSearch;
