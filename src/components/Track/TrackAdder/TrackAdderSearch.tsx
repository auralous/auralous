import React, { useCallback, useRef, useState } from "react";
import { useClient } from "urql";
import { useMAuth } from "~/hooks/user";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { PlatformName, Track, SearchTrackDocument } from "~/graphql/gql.gen";
import { TrackAdderCallbackFn } from "./types";
import { SvgX } from "~/assets/svg";

const TrackAdderSearch: React.FC<{
  callback: TrackAdderCallbackFn;
  addedTracks: string[];
  platform?: PlatformName;
}> = ({ addedTracks, callback }) => {
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
    <>
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
            aria-label="Search"
            placeholder="Find by keywords or links"
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
      {isSearching && (
        <p className="px-2 py-6 text-center font-bold text-foreground-tertiary animate-pulse">
          Searching...
        </p>
      )}
      {isEmpty && (
        <div className="px-2">
          <div className="p-2 rounded-lg bg-success-light text-xs">
            To search, enter the song keywords <b>or</b> a <i>Song link</i>{" "}
            <b>or</b> a <i>Playlist link</i>.
          </div>
        </div>
      )}
      <TrackAdderResults
        addedTracks={addedTracks}
        callback={callback}
        results={queryResults.map(({ id }) => id)}
      />
    </>
  );
};

export default TrackAdderSearch;
