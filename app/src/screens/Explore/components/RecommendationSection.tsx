import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { LoadingScreen } from "@/components/Loading";
import { PlaylistItem } from "@/components/Playlist";
import { RouteName } from "@/screens/types";
import type { Playlist } from "@auralous/api";
import { useRecommendationContentQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { memo } from "react";
import type { ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";
import ExploreSection from "./ExploreSection";
import scrollStyles from "./ScrollView.styles";

const RecommendationItem = memo<{ playlist: Playlist; style: ViewStyle }>(
  function RecommendationItem({ playlist, style }) {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        style={style}
        onPress={() =>
          navigation.navigate(RouteName.Playlist, { id: playlist.id })
        }
      >
        <PlaylistItem playlist={playlist} />
      </TouchableOpacity>
    );
  }
);

const renderItem: HorizontalListProps<Playlist>["renderItem"] = (info) => (
  <RecommendationItem
    style={info.style}
    playlist={info.item}
    key={info.item.id}
  />
);

const RecommendationSection: FC<{
  id: string;
  title: string;
  description?: string | null;
}> = ({ id, title, description }) => {
  const [{ data, fetching }] = useRecommendationContentQuery({
    variables: {
      id,
      limit: 10,
    },
  });

  return (
    <ExploreSection
      title={title}
      description={description}
      href={`/explore/${id}`}
    >
      <HorizontalList
        style={scrollStyles.scroll}
        contentContainerStyle={scrollStyles.scrollContent}
        data={data?.recommendationContent}
        renderItem={renderItem}
        ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      />
    </ExploreSection>
  );
};

export default RecommendationSection;
