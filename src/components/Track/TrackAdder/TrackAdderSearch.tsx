import React, { useRef, useState } from "react";
import { useClient } from "urql";
import { useMAuth } from "~/hooks/user";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { SvgX } from "~/assets/svg";
import { PlatformName, Track } from "~/graphql/gql.gen";
import { QUERY_TRACK, QUERY_SEARCH_TRACK } from "~/graphql/track";

const PLATFORM_FULL_NAME: Record<PlatformName, "YouTube" | "Spotify"> = {
  youtube: "YouTube",
  spotify: "Spotify",
};

const isValidUrl = (string: string) => {
  try {
    return new URL(string);
  } catch (_) {
    return false;
  }
};

const TrackAdderSearch: React.FC<{
  callback: (cbTrack: string[]) => any;
  addedTracks: string[];
  platform?: PlatformName;
}> = ({ addedTracks, callback }) => {
  const { data: mAuth } = useMAuth();
  const platform = mAuth?.platform || PlatformName.Youtube;
  const [queryResults, setQueryResults] = useState<Track[]>([]);
  const urqlClient = useClient();
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function submitSearch(searchQuery = "") {
    const query = searchQuery.trim();
    if (!searchQuery || isSearching) return;
    setIsSearching(true);
    if (isValidUrl(searchQuery)) {
      const response = await urqlClient
        .query(QUERY_TRACK, {
          uri: query,
        })
        .toPromise();
      setQueryResults(response.data.track ? [response.data.track] : []);
    } else {
      const response = await urqlClient
        .query(QUERY_SEARCH_TRACK, {
          platform,
          query,
        })
        .toPromise();
      setQueryResults(response.data.searchTrack || []);
    }
    setIsSearching(false);
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          if (!inputRef.current) return;
          submitSearch(inputRef.current.value);
        }}
        className=""
        autoComplete="off"
      >
        <div className="relative w-full">
          <input
            ref={inputRef}
            className="input w-full h-10"
            type="text"
            aria-label="Search"
            placeholder={`Search for music on ${PLATFORM_FULL_NAME[platform]} or enter a link`}
            required
          />
          <button
            title="Remove search results"
            type="button"
            className="absolute right-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2"
            onClick={() => {
              if (!inputRef.current) return;
              inputRef.current.value = "";
              setQueryResults([]);
            }}
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
      <TrackAdderResults
        addedTracks={addedTracks}
        callback={callback}
        results={queryResults.map(({ id }) => id)}
      />
    </>
  );
};

export default TrackAdderSearch;
