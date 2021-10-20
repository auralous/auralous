import { PlaylistItem } from "@/components/Playlist";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { LayoutSize, Size } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import {
  useRecommendationContentQuery,
  useRecommendationSectionQuery,
} from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useLayoutEffect, useMemo } from "react";
import type { ListRenderItem } from "react-native";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const styles = StyleSheet.create({
  item: {
    flex: 1,
    padding: Size[2],
  },
  root: {
    flex: 1,
  },
});

const RecommendationItem: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate(RouteName.Playlist, { id: playlist.id })
      }
    >
      <PlaylistItem playlist={playlist} />
    </TouchableOpacity>
  );
};

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
    variables: { id },
  });

  useLayoutEffect(() => {
    if (dataSection?.recommendationSection?.title) {
      navigation.setOptions({
        title: dataSection?.recommendationSection?.title,
      });
    }
  }, [navigation, dataSection?.recommendationSection?.title]);

  const [{ data }] = useRecommendationContentQuery({
    variables: {
      id,
      limit: 50,
    },
  });

  const windowWidth = useWindowDimensions().width;
  const numColumns =
    windowWidth >= 1366
      ? 6
      : windowWidth >= LayoutSize.lg
      ? 4
      : windowWidth >= LayoutSize.md
      ? 3
      : 2;

  const listData = useMemo(() => {
    if (!data?.recommendationContent) return undefined;
    // If the # of items is odd, the last items will have full widths due to flex: 1
    // we manually cut them off
    const len = data.recommendationContent.length;
    const maxlen = len - (len % numColumns);
    return data.recommendationContent.slice(0, maxlen);
  }, [data, numColumns]);

  return (
    <FlatList
      key={numColumns}
      renderItem={renderItem}
      data={listData}
      style={styles.root}
      numColumns={numColumns}
    />
  );
};

export default ExploreRecommendationScreen;
