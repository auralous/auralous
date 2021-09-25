import { LoadingScreen } from "@/components/Loading";
import { PlaylistListItem } from "@/components/Playlist";
import type { RecyclerRenderItem } from "@/components/RecyclerList";
import { RecyclerList } from "@/components/RecyclerList";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import SearchEmpty from "./SearchEmpty";

interface SelectablePlaylistListProps {
  fetching: boolean;
  playlists: Playlist[];
  onSelect(playlist: Playlist): void;
}

const itemPadding = Size[1];

const styles = StyleSheet.create({
  item: {
    padding: itemPadding,
  },
});

const SelectablePlaylistList: FC<SelectablePlaylistListProps> = ({
  fetching,
  playlists,
  onSelect,
}) => {
  const renderItem = useCallback<RecyclerRenderItem<Playlist>>(
    ({ item }) => (
      <TouchableOpacity
        key={item.id}
        style={styles.item}
        onPress={() => onSelect(item)}
      >
        <PlaylistListItem playlist={item} />
      </TouchableOpacity>
    ),
    [onSelect]
  );

  return (
    <RecyclerList
      ListEmptyComponent={fetching ? <LoadingScreen /> : <SearchEmpty />}
      data={playlists}
      height={Size[12] + itemPadding * 2 + Size[3]} // height + 2 * padding + seperator
      renderItem={renderItem}
    />
  );
};

export default SelectablePlaylistList;
