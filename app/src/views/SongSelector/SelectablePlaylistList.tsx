import { LoadingScreen } from "@/components/Loading";
import { PlaylistListItem } from "@/components/Playlist";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { BigListRenderItem } from "react-native-big-list";
import BigList from "react-native-big-list";
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
  const renderItem = useCallback<BigListRenderItem<Playlist>>(
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
    <BigList
      ListEmptyComponent={fetching ? <LoadingScreen /> : <SearchEmpty />}
      data={playlists}
      itemHeight={Size[12] + itemPadding * 2 + Size[2]} // height + 2 * padding + seperator
      renderItem={renderItem}
    />
  );
};

export default SelectablePlaylistList;
