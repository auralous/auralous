import { Playlist } from "@auralous/api";
import { LoadingBlock } from "@auralous/ui/components/Loading";
import { PlaylistListItem } from "@auralous/ui/components/Playlist";
import { commonStyles, Size } from "@auralous/ui/styles";
import { FC, useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchEmpty from "./SearchEmpty";

interface SelectablePlaylistListProps {
  fetching: boolean;
  playlists: Playlist[];
  onSelect(playlist: Playlist): void;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  item: {
    padding: Size[2],
  },
});

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

  if (fetching)
    return (
      <View style={commonStyles.fillAndCentered}>
        <LoadingBlock />
      </View>
    );

  return (
    <>
      {playlists.length === 0 && <SearchEmpty />}
      <FlatList style={styles.root} data={playlists} renderItem={renderItem} />
    </>
  );
};

export default SelectablePlaylistList;
