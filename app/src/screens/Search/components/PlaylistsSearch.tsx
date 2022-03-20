import { LoadingScreen } from "@/components/Loading";
import { PlaylistItem } from "@/components/Playlist";
import { Text } from "@/components/Typography";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { useUiLayout } from "@/ui-context/UIContext";
import type { Playlist } from "@auralous/api";
import { usePlaylistsSearchQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./ItemsSearch.styles";

const SearchItem: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const navigation = useNavigation();
  const uiNumColumn = useUiLayout().column6432;
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
};

const renderItem: ListRenderItem<Playlist> = ({ item }) => (
  <SearchItem playlist={item} key={item.id} />
);

const PlaylistsSearch: FC<{ query: string }> = ({ query }) => {
  const { t } = useTranslation();
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
      numColumns={numColumns}
      ListEmptyComponent={
        fetching ? (
          <LoadingScreen />
        ) : (
          <View>
            <Text color="textSecondary" align="center">
              {t("common.result.search_empty")}
            </Text>
          </View>
        )
      }
    />
  );
};

export default PlaylistsSearch;
