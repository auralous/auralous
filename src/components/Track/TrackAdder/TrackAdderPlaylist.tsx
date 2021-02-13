import { SvgChevronLeft, SvgLoadingAnimated } from "assets/svg";
import { PlaylistItem } from "components/Playlist";
import {
  Playlist,
  useMyPlaylistsQuery,
  usePlaylistTracksQuery,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import React, { useMemo, useState } from "react";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { TrackAdderCallbackFn } from "./types";

const TrackAdderPlaylist: React.FC<{
  addedTracks: string[];
  callback: TrackAdderCallbackFn;
}> = ({ addedTracks, callback }) => {
  const { t } = useI18n();

  const [
    { data: { myPlaylists } = { myPlaylists: undefined }, fetching },
  ] = useMyPlaylistsQuery();

  const [selectedPlaylist, setSelectedPlaylist] = useState<null | Playlist>(
    null
  );

  async function handleSelect(playlist: Playlist) {
    setSelectedPlaylist(playlist);
  }

  const [
    {
      data: { playlistTracks } = { playlistTracks: undefined },
      fetching: fetchingTracks,
    },
  ] = usePlaylistTracksQuery({
    variables: { id: selectedPlaylist?.id || "" },
    pause: !selectedPlaylist,
  });

  const queryResults = useMemo(
    () => playlistTracks?.map((track) => track.id) || null,
    [playlistTracks]
  );

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="text-sm px-2 h-10 flex items-center font-bold">
        <button
          onClick={() => setSelectedPlaylist(null)}
          title="Select another playlist"
          className="btn btn-transparent p-1 inline mr-2"
          disabled={!selectedPlaylist}
        >
          <SvgChevronLeft width="24" height="24" />
        </button>
        {!!selectedPlaylist && (
          <div className="inline-flex items-center">
            <img
              src={selectedPlaylist.image}
              alt={selectedPlaylist.name}
              className="w-6 h-6 mr-1 rounded"
            />
            {selectedPlaylist.name}
          </div>
        )}
      </div>
      {selectedPlaylist ? (
        <TrackAdderResults
          addedTracks={addedTracks}
          callback={callback}
          results={queryResults || []}
        />
      ) : (
        <div className="flex-1 h-0 overflow-auto space-y-1">
          {myPlaylists?.map((playlist) => (
            <button
              key={playlist.id}
              title={t("track.adder.playlist.selectSongFrom", {
                title: playlist.name,
              })}
              className="p-2 rounded-lg w-full focus:outline-none hover:bg-background-secondary focus:bg-background-secondary"
              onClick={() => handleSelect(playlist)}
            >
              <PlaylistItem playlist={playlist} />
            </button>
          ))}
        </div>
      )}
      {(fetching || fetchingTracks) && (
        <SvgLoadingAnimated className="absolute-center" />
      )}
    </div>
  );
};

export default TrackAdderPlaylist;
