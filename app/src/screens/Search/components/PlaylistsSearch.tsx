import { RNLink } from "@/components/Link";
import { LoadingScreen } from "@/components/Loading";
import { PlaylistItem } from "@/components/Playlist";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { use6432Layout } from "@/ui-context";
import SearchEmpty from "@/views/SongSelector/SearchEmpty";
import type { Playlist } from "@auralous/api";
import { usePlaylistsSearchQuery } from "@auralous/api";
import type { FC } from "react";
import { memo } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./ItemsSearch.styles";

const SearchItem = memo<{ playlist: Playlist }>(function SearchItem({
  playlist,
}) {
  const uiNumColumn = use6432Layout();
  return (
    <RNLink
      style={[styles.item, { maxWidth: (1 / uiNumColumn) * 100 + "%" }]}
      to={{
        screen: RouteName.Playlist,
        params: { id: playlist.id },
      }}
    >
      <PlaylistItem playlist={playlist} />
    </RNLink>
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
