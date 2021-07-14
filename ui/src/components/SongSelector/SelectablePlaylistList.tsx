import { Playlist } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui/components/Loading";
import { PlaylistListItem } from "@auralous/ui/components/Playlist";
import {
  RecyclerList,
  RecyclerRenderItem,
} from "@auralous/ui/components/RecyclerList";
import { Size } from "@auralous/ui/styles";
import { FC, useCallback } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
  full: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
