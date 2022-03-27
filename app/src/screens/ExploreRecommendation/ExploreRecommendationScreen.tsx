import { useContainerStyle } from "@/components/Container";
import { PlaylistItem } from "@/components/Playlist";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { useFlatlist6432Layout } from "@/styles/flatlist";
import { Size } from "@/styles/spacing";
import { use6432Layout } from "@/ui-context";
import type { Playlist } from "@auralous/api";
import { useRecommendationSectionQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { memo, useLayoutEffect } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: Size[2],
  },
  root: {
    flex: 1,
  },
});

const RecommendationItem = memo<{ playlist: Playlist }>(
  function RecommendationItem({ playlist }) {
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
  }
);

const renderItem: ListRenderItem<Playlist> = ({ item }) => (
  <RecommendationItem playlist={item} key={item.id} />
);

const ExploreRecommendationScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.ExploreRecommendation>
> = ({
  navigation,
  route: {
    params: { id },
  },
}) => {
  const [{ data: dataSection }] = useRecommendationSectionQuery({
    variables: { id, playlistLimit: 50 },
  });

  useLayoutEffect(() => {
    if (dataSection?.recommendationSection?.title) {
      navigation.setOptions({
        title: dataSection?.recommendationSection?.title,
      });
    }
  }, [navigation, dataSection?.recommendationSection?.title]);

  const { data, numColumns } = useFlatlist6432Layout(
    dataSection?.recommendationSection?.playlists
  );

  const containerStyle = useContainerStyle();

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={data}
      style={styles.root}
      contentContainerStyle={containerStyle}
      numColumns={numColumns}
    />
  );
};

export default ExploreRecommendationScreen;
