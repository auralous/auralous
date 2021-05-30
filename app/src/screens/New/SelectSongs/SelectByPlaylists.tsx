import { IconX } from "@/assets/svg";
import { Text } from "@/components/Typography";
import {
  Playlist,
  useMyPlaylistsQuery,
  usePlaylistsSearchQuery,
  usePlaylistTracksQuery,
} from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  SelectableTrackList,
  SelectableTrackListProps,
} from "../SelectableTrackList";
import SelectablePlaylistList from "./SelectablePlaylistList";

interface SelectByPlaylistsProps extends SelectableTrackListProps {
  search: string;
}

const styles = StyleSheet.create({
  metaBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Size[1],
    paddingHorizontal: Size[1],
    height: Size[8],
  },
  close: {
    padding: Size[1],
  },
  tracks: {
    flex: 1,
  },
});

const MyPlaylists: React.FC<{
  onSelect(playlist: Playlist): void;
}> = ({ onSelect }) => {
  const { t } = useTranslation();

  const [
    { data: { myPlaylists } = { myPlaylists: undefined }, fetching },
  ] = useMyPlaylistsQuery();

  return (
    <>
      <View style={styles.metaBar}>
        <Text bold>{t("playlist.my_playlists")}</Text>
      </View>
      <SelectablePlaylistList
        playlists={myPlaylists || []}
        fetching={fetching}
        onSelect={onSelect}
      />
    </>
  );
};

const SearchPlaylists: React.FC<{
  search: string;
  onSelect(playlist: Playlist): void;
}> = ({ search, onSelect }) => {
  const [
    { data: { playlistsSearch } = { playlistsSearch: undefined }, fetching },
  ] = usePlaylistsSearchQuery({
    variables: { query: search },
    pause: !search,
  });
  return (
    <SelectablePlaylistList
      playlists={playlistsSearch || []}
      fetching={fetching}
      onSelect={onSelect}
    />
  );
};

const PlaylistTrackList: React.FC<
  SelectableTrackListProps & { playlist: Playlist; close(): void }
> = ({ playlist, selectedTracks, addTracks, removeTrack, close }) => {
  const [
    { data: { playlistTracks } = { playlistTracks: undefined }, fetching },
  ] = usePlaylistTracksQuery({ variables: { id: playlist.id } });

  const colors = useColors();

  return (
    <>
      <View style={styles.metaBar}>
        <Text bold>{playlist.name}</Text>
        <TouchableOpacity style={styles.close} onPress={close}>
          <IconX stroke={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.tracks}>
        <SelectableTrackList
          selectedTracks={selectedTracks}
          data={playlistTracks || []}
          addTracks={addTracks}
          removeTrack={removeTrack}
          fetching={fetching}
        />
      </View>
    </>
  );
};

const SelectByPlaylists: React.FC<SelectByPlaylistsProps> = ({
  search,
  selectedTracks,
  addTracks,
  removeTrack,
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );

  const closePlaylist = useCallback(() => setSelectedPlaylist(null), []);

  if (selectedPlaylist)
    return (
      <PlaylistTrackList
        playlist={selectedPlaylist}
        selectedTracks={selectedTracks}
        addTracks={addTracks}
        removeTrack={removeTrack}
        close={closePlaylist}
      />
    );
  if (!search) return <MyPlaylists onSelect={setSelectedPlaylist} />;

  return <SearchPlaylists search={search} onSelect={setSelectedPlaylist} />;
};

export default SelectByPlaylists;
