import { LoadingScreen } from "@/components/Loading";
import { PlaylistListItem } from "@/components/Playlist";
import { ResultEmptyScreen } from "@/components/Result";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface SelectablePlaylistListProps {
  fetching: boolean;
  playlists: Playlist[];
  onSelect(playlist: Playlist): void;
}

const paddingVertical = Size[1.5];

const styles = StyleSheet.create({
  item: { paddingVertical },
});

const itemHeight = Size[12] + 2 * paddingVertical;
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

const SelectablePlaylistList: FC<SelectablePlaylistListProps> = ({
  fetching,
  playlists,
  onSelect,
}) => {
  const renderItem = useCallback<ListRenderItem<Playlist>>(
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
    <FlatList
      ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
      data={playlists}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={0}
      removeClippedSubviews
      windowSize={10}
    />
  );
};

export default SelectablePlaylistList;
