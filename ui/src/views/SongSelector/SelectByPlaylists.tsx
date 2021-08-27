import { IconX } from "@/assets";
import { TextButton } from "@/components";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import {
  Playlist,
  useMyPlaylistsQuery,
  usePlaylistsSearchQuery,
  usePlaylistTracksQuery,
} from "@auralous/api";
import { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelectedTracks, useUpdateTracks } from "./Context";
import SelectablePlaylistList from "./SelectablePlaylistList";
import SelectableTrackList from "./SelectableTrackList";

interface SelectByPlaylistsProps {
  search: string;
}

const styles = StyleSheet.create({
  close: {
    padding: Size[1],
  },
  metaBar: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[8],
    justifyContent: "space-between",
    marginBottom: Size[1],
    paddingHorizontal: Size[1],
  },
  tracks: {
    flex: 1,
  },
});

const MyPlaylists: FC<{
  onSelect(playlist: Playlist): void;
}> = ({ onSelect }) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useMyPlaylistsQuery();

  return (
    <>
      <View style={styles.metaBar}>
        <Text bold>{t("playlist.my_playlists")}</Text>
      </View>
      <SelectablePlaylistList
        playlists={data?.myPlaylists || []}
        fetching={fetching}
        onSelect={onSelect}
      />
    </>
  );
};

const SearchPlaylists: FC<{
  search: string;
  onSelect(playlist: Playlist): void;
}> = ({ search, onSelect }) => {
  const [{ data, fetching }] = usePlaylistsSearchQuery({
    variables: { query: search },
    pause: !search,
  });

  const playlistSearch = search ? data?.playlistsSearch : null;

  return (
    <SelectablePlaylistList
      playlists={playlistSearch || []}
      fetching={fetching}
      onSelect={onSelect}
    />
  );
};

const PlaylistTrackList: FC<{ playlist: Playlist; close(): void }> = ({
  playlist,
  close,
}) => {
  const { t } = useTranslation();
  const [
    { data: { playlistTracks } = { playlistTracks: undefined }, fetching },
  ] = usePlaylistTracksQuery({ variables: { id: playlist.id } });

  const selectedTracks = useSelectedTracks();

  const updateTracksActions = useUpdateTracks();
  const addAllTracks = useMemo(
    () =>
      (playlistTracks || [])
        .filter((playlistTrack) => !selectedTracks.includes(playlistTrack.id))
        .map((playlistTrack) => playlistTrack.id),
    [selectedTracks, playlistTracks]
  );
  const onAddAll = useCallback(() => {
    updateTracksActions?.addTracks(addAllTracks);
  }, [addAllTracks, updateTracksActions]);

  return (
    <>
      <View style={styles.metaBar}>
        <View>
          <Text bold>{playlist.name}</Text>
        </View>
        <TouchableOpacity style={styles.close} onPress={close}>
          <IconX />
        </TouchableOpacity>
      </View>
      <View style={styles.tracks}>
        <TextButton
          textProps={{ size: "sm" }}
          onPress={onAddAll}
          disabled={addAllTracks.length === 0}
        >
          {t("select_songs.playlists.add_all_songs")}
        </TextButton>
        <SelectableTrackList data={playlistTracks || []} fetching={fetching} />
      </View>
    </>
  );
};

const SelectByPlaylists: FC<SelectByPlaylistsProps> = ({ search }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );

  const closePlaylist = useCallback(() => setSelectedPlaylist(null), []);

  if (selectedPlaylist)
    return (
      <PlaylistTrackList playlist={selectedPlaylist} close={closePlaylist} />
    );
  if (!search) return <MyPlaylists onSelect={setSelectedPlaylist} />;

  return <SearchPlaylists search={search} onSelect={setSelectedPlaylist} />;
};

export default SelectByPlaylists;
