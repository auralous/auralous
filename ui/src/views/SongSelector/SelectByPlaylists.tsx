import { IconX } from "@/assets";
import { Text } from "@/components/Typography";
import { Size } from "@/styles";
import {
  Playlist,
  useMyPlaylistsQuery,
  usePlaylistsSearchQuery,
  usePlaylistTracksQuery,
} from "@auralous/api";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
  const [
    { data: { playlistTracks } = { playlistTracks: undefined }, fetching },
  ] = usePlaylistTracksQuery({ variables: { id: playlist.id } });

  return (
    <>
      <View style={styles.metaBar}>
        <Text bold>{playlist.name}</Text>
        <TouchableOpacity style={styles.close} onPress={close}>
          <IconX />
        </TouchableOpacity>
      </View>
      <View style={styles.tracks}>
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
