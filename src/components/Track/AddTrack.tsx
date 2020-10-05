import React, { useState, useCallback, useRef, useMemo } from "react";
import { useClient } from "urql";
import { ListChildComponentProps, areEqual, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { TrackItem } from "./TrackItem";
import { QUERY_SEARCH_TRACK, QUERY_TRACK } from "~/graphql/track";
import { Track, PlatformName } from "~/graphql/gql.gen";
import { useMyPlaylistsQuery } from "~/hooks/playlist/index";
import { Playlist } from "~/types/index";
import { SvgX, SvgPlus, SvgCheck, SvgChevronLeft } from "~/assets/svg";
import { useMAuth } from "~/hooks/user";

const PLATFORM_FULL_NAME: Record<PlatformName, "YouTube" | "Spotify"> = {
  youtube: "YouTube",
  spotify: "Spotify",
};

// SEARCH

const SearchResultRow = React.memo<ListChildComponentProps>(function Row({
  data,
  index,
  style,
}) {
  const added = useMemo(() => data.addedTracks.includes(data.items[index]), [
    data,
    index,
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div
      className="p-2 flex items-center justify-between border-b-2 border-opacity-25 border-background-secondary "
      role="presentation"
      key={data.items[index]}
      style={style}
    >
      <TrackItem id={data.items[index]} />
      <div className="flex content-end items-center ml-2">
        <button
          type="button"
          aria-label="Add track"
          className={`h-10 px-3 py-2 flex items-center ${
            added ? "" : "hover:bg-background-secondary"
          } ${
            isAdding ? "opacity-50" : ""
          } transition duration-200 rounded-full`}
          onClick={async () => {
            if (
              added &&
              !window.confirm("This song has already been added. Add again?")
            )
              return;
            setIsAdding(true);
            await data.callback(data.items[index]);
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

const SearchResults: React.FC<{
  results: string[];
  callback: (cbTrack: string | string[]) => Promise<void>;
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
            itemSize={72}
            itemData={{ items: results, callback, addedTracks }}
          >
            {SearchResultRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};

const PlaylistItem: React.FC<{
  playlist: Playlist;
  handleSelect: (pl: Playlist) => void;
}> = ({ playlist, handleSelect }) => {
  return (
    <div
      role="button"
      title={`Select songs from ${playlist.title}`}
      onKeyDown={({ keyCode }) => keyCode === 13 && handleSelect(playlist)}
      tabIndex={0}
      className="flex items-center border-b-2 border-background-secondary hover:bg-white hover:bg-opacity-10 p-2 w-full"
      onClick={() => handleSelect(playlist)}
    >
      <img
        className="w-12 h-12 rounded-lg object-cover"
        src={playlist.image}
        alt={playlist.title}
      />
      <div className="ml-2 text-left">
        <p>{playlist.title}</p>
        <p className="text-foreground-secondary text-sm">
          {playlist.tracks.length} tracks
        </p>
      </div>
    </div>
  );
};

const AddByPlaylist: React.FC<{
  addedTracks: string[];
  callback: (cbTrack: string | string[]) => Promise<void>;
}> = ({ addedTracks, callback }) => {
  const { data: myPlaylists, isLoading } = useMyPlaylistsQuery();

  const [selectedPlaylist, setSelectedPlaylist] = useState<null | Playlist>(
    null
  );

  async function handleSelect(playlist: Playlist) {
    setSelectedPlaylist(playlist);
  }

  const queryResults = useMemo(
    () => selectedPlaylist?.tracks.map((trackId) => trackId) || null,
    [selectedPlaylist]
  );

  return (
    <>
      <div className="border-background-tertiary px-2 h-10 flex items-center font-bold text-lg">
        <button
          onClick={() => setSelectedPlaylist(null)}
          title="Select another playlist"
          className="button p-1 bg-transparent inline mr-2"
          disabled={!selectedPlaylist}
        >
          <SvgChevronLeft width="28" height="28" />
        </button>
        {selectedPlaylist ? (
          <>
            <div className="inline-flex items-center">
              <img
                src={selectedPlaylist.image}
                alt={selectedPlaylist.title}
                className="w-6 h-6 mr-1 rounded"
              />
              {selectedPlaylist.title}
            </div>
          </>
        ) : (
          "Select a playlist"
        )}
      </div>
      {selectedPlaylist ? (
        <SearchResults
          addedTracks={addedTracks}
          callback={callback}
          results={queryResults || []}
        />
      ) : (
        <div className="overflow-auto">
          {isLoading && (
            <p className="px-2 py-6 text-center font-bold text-foreground-tertiary animate-pulse">
              Loading playlist
            </p>
          )}
          {myPlaylists?.map((playlist) => (
            // TODO: react-window
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              handleSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};

const isValidUrl = (string: string) => {
  try {
    return new URL(string);
  } catch (_) {
    return false;
  }
};

function SearchForm({
  setQueryResults,
  platform,
}: {
  setQueryResults: React.Dispatch<React.SetStateAction<Track[]>>;
  platform: PlatformName;
}) {
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
    </>
  );
}

const AddBySearch: React.FC<{
  callback: (cbTrack: string | string[]) => Promise<void>;
  addedTracks: string[];
  platform?: PlatformName;
}> = ({ addedTracks, callback }) => {
  const { data: mAuth } = useMAuth();

  const platform = mAuth?.platform || PlatformName.Youtube;

  const [queryResults, setQueryResults] = useState<Track[]>([]);

  return (
    <>
      <SearchForm platform={platform} setQueryResults={setQueryResults} />
      <SearchResults
        addedTracks={addedTracks}
        callback={callback}
        results={queryResults.map(({ id }) => id)}
      />
    </>
  );
};

export default function AddNewTrack({
  callback,
  addedTracks,
  platform,
}: {
  callback: (cbTrack: string[]) => Promise<void>;
  addedTracks: string[];
  platform?: PlatformName;
}) {
  const [tab, setTab] = useState<"track" | "playlist">("track");
  const proxyCallback = useCallback(
    async (trackOrTracks: string | string[]) => {
      const newTrackArray = Array.isArray(trackOrTracks)
        ? trackOrTracks
        : [trackOrTracks];
      if (newTrackArray.length === 0) return;
      return callback(newTrackArray);
    },
    [callback]
  );
  return (
    <div className="flex flex-col" style={{ height: "75vh" }}>
      <div role="tablist" className="flex mb-2 flex-none">
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold ${
            tab === "track" ? "bg-foreground text-background" : "opacity-75"
          }`}
          aria-controls="tabpanel_tracks"
          onClick={() => setTab("track")}
          aria-selected={tab === "track"}
        >
          Songs
        </button>
        <button
          role="tab"
          className={`flex-1 mx-1 p-1 text-sm rounded-lg font-bold  ${
            tab === "playlist" ? "bg-foreground text-background" : "opacity-75"
          }`}
          aria-controls="tabpanel_playlists"
          onClick={() => setTab("playlist")}
          aria-selected={tab === "playlist"}
        >
          Playlists
        </button>
      </div>
      <div
        aria-labelledby="tabpanel_tracks"
        role="tabpanel"
        aria-hidden={tab !== "track"}
        hidden={tab !== "track"}
        className={`${tab === "track" ? "flex" : "hidden"} flex-col flex-1 h-0`}
      >
        <AddBySearch
          addedTracks={addedTracks}
          callback={proxyCallback}
          platform={platform}
        />
      </div>
      <div
        aria-labelledby="tabpanel_playlists"
        role="tabpanel"
        aria-hidden={tab !== "playlist"}
        className={`${
          tab === "playlist" ? "flex" : "hidden"
        } flex-col flex-1 h-0`}
      >
        <AddByPlaylist addedTracks={addedTracks} callback={proxyCallback} />
      </div>
    </div>
  );
}
