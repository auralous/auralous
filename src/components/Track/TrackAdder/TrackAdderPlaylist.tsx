import { SvgChevronLeft, SvgSpinnerAlt } from "assets/svg";
import { PlaylistItem } from "components/Playlist";
import { Button, PressableHighlight } from "components/Pressable";
import { Typography } from "components/Typography";
import { Box } from "components/View";
import {
  Playlist,
  useMyPlaylistsQuery,
  usePlaylistTracksQuery,
} from "gql/gql.gen";
import { useI18n } from "i18n/index";
import { useMemo, useState } from "react";
import { default as TrackAdderResults } from "./TrackAdderResults";
import { TrackAdderCallbackFn } from "./types";

const TrackAdderPlaylist: React.FC<{
  addedTracks: string[];
  callback: TrackAdderCallbackFn;
  inactive?: boolean;
}> = ({ addedTracks, callback, inactive }) => {
  const { t } = useI18n();

  const [
    { data: { myPlaylists } = { myPlaylists: undefined }, fetching },
  ] = useMyPlaylistsQuery({
    pause: inactive,
  });

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
    <Box fullWidth fullHeight position="relative">
      <Box row paddingX="sm" height={10} alignItems="center" gap="sm">
        <Button
          onPress={() => setSelectedPlaylist(null)}
          accessibilityLabel={t("common.back")}
          icon={<SvgChevronLeft />}
          disabled={!selectedPlaylist}
          styling="link"
        />
        {!!selectedPlaylist && (
          <>
            <img
              src={selectedPlaylist.image}
              alt={selectedPlaylist.name}
              className="w-6 h-6"
            />
            <Typography.Text strong size="sm">
              {selectedPlaylist.name}
            </Typography.Text>
          </>
        )}
      </Box>
      {selectedPlaylist ? (
        <TrackAdderResults
          addedTracks={addedTracks}
          callback={callback}
          results={(!fetchingTracks && queryResults) || []}
        />
      ) : (
        <Box style={{ overflow: "auto" }} flex={1} minHeight={0} gap="xs">
          {myPlaylists?.map((playlist) => (
            <PressableHighlight
              key={playlist.id}
              accessibilityLabel={t("track.adder.playlist.selectSongFrom", {
                title: playlist.name,
              })}
              onPress={() => handleSelect(playlist)}
              fullWidth
            >
              <PlaylistItem playlist={playlist} />
            </PressableHighlight>
          ))}
        </Box>
      )}
      {(fetching || fetchingTracks) && (
        <div className="absolute-center">
          <SvgSpinnerAlt className="animate-spin" />
        </div>
      )}
    </Box>
  );
};

export default TrackAdderPlaylist;
