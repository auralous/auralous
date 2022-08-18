import { LoadingScreen } from "@/components/Loading";
import { PlaylistListItem } from "@/components/Playlist";
import { ResultEmptyScreen } from "@/components/Result";
import { Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import type { ListRenderItem } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

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

const SelectablePlaylistList: FC<SelectablePlaylistListProps> = ({
  fetching,
  playlists,
  onSelect,
}) => {
  const renderItem = useCallback<ListRenderItem<Playlist>>(
    ({ item }) => (
      <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
        <PlaylistListItem playlist={item} />
      </TouchableOpacity>
    ),
    [onSelect]
  );

  return (
    <FlashList
      ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
      data={playlists}
      renderItem={renderItem}
      estimatedItemSize={itemHeight}
    />
  );
};

export default SelectablePlaylistList;
