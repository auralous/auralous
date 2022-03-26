import { LoadingScreen } from "@/components/Loading";
import { PlaylistItem } from "@/components/Playlist";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { use6432Layout } from "@/ui-context";
import SearchEmpty from "@/views/SongSelector/SearchEmpty";
import type { Playlist } from "@auralous/api";
import { usePlaylistsSearchQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { memo } from "react";
import type { ListRenderItem } from "react-native";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./ItemsSearch.styles";

const SearchItem = memo<{ playlist: Playlist }>(function SearchItem({
  playlist,
}) {
  const navigation = useNavigation();
  const uiNumColumn = use6432Layout();
  return (
    <TouchableOpacity
      style={[styles.item, { maxWidth: (1 / uiNumColumn) * 100 + "%" }]}
      onPress={() =>
        navigation.navigate(RouteName.Playlist, { id: playlist.id })
      }
    >
      <PlaylistItem playlist={playlist} />
    </TouchableOpacity>
  );
});

const renderItem: ListRenderItem<Playlist> = ({ item }) => (
  <SearchItem playlist={item} key={item.id} />
);

const PlaylistsSearch: FC<{ query: string }> = ({ query }) => {
  const [{ data: dataSearch, fetching }] = usePlaylistsSearchQuery({
    variables: { query },
  });

  const { data, numColumns } = useFlatlist6432Layout(
    dataSearch?.playlistsSearch
  );

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={data}
      style={styles.root}
      contentContainerStyle={styles.horPad}
      numColumns={numColumns}
      ListEmptyComponent={fetching ? LoadingScreen : SearchEmpty}
    />
  );
};

export default PlaylistsSearch;
