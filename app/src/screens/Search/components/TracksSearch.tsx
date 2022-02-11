import { LoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { Size } from "@/styles/spacing";
import type { Track } from "@auralous/api";
import { useSearchTrackQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "./ItemsSearch.styles";

const SearchItem: FC<{ track: Track }> = ({ track }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ padding: Size[1] }}>
      <TrackItem track={track} />
    </TouchableOpacity>
  );
};

const renderItem: ListRenderItem<Track> = ({ item }) => (
  <SearchItem track={item} key={item.id} />
);

const ItemSeparatorComponent = () => <Spacer y={2} />;
const TracksSearch: FC<{ query: string }> = ({ query }) => {
  const { t } = useTranslation();
  const [{ data: dataQuery, fetching }] = useSearchTrackQuery({
    variables: { query },
  });

  const { data, numColumns } = useFlatlist6432Layout(dataQuery?.searchTrack);

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={data}
      style={styles.root}
      ListEmptyComponent={
        fetching ? (
          <LoadingScreen />
        ) : (
          <Text color="textSecondary" align="center">
            {t("common.result.search_empty")}
          </Text>
        )
      }
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};

export default TracksSearch;
