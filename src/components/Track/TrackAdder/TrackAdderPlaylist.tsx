import React, { useMemo, useState } from "react";
import { SvgChevronLeft } from "~/assets/svg";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { useMyPlaylistsQuery } from "~/hooks/playlist";
import { Playlist } from "~/types/index";

const PlaylistItem: React.FC<{
  playlist: Playlist;
  handleSelect: (pl: Playlist) => void;
}> = ({ playlist, handleSelect }) => {
  return (
    <div
      role="button"
      title={`Select songs from ${playlist.title}`}
      onKeyDown={({ key }) => key === "Enter" && handleSelect(playlist)}
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

const TrackAdderPlaylist: React.FC<{
  addedTracks: string[];
  callback: (cbTrack: string[]) => any;
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
      <div className="text-sm px-2 h-10 flex items-center font-bold">
        <button
          onClick={() => setSelectedPlaylist(null)}
          title="Select another playlist"
          className="button p-1 bg-transparent inline mr-2"
          disabled={!selectedPlaylist}
        >
          <SvgChevronLeft width="24" height="24" />
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
        <TrackAdderResults
          addedTracks={addedTracks}
          callback={callback}
          results={queryResults || []}
        />
      ) : (
        <div className="flex-1 h-0 overflow-auto">
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

export default TrackAdderPlaylist;
