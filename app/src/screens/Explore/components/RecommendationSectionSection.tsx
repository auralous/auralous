import type { HorizontalListProps } from "@/components/ContentList";
import { HorizontalList } from "@/components/ContentList";
import { RNLink } from "@/components/Link";
import { PlaylistItem } from "@/components/Playlist";
import { ResultEmptyScreen } from "@/components/Result";
import { RouteName } from "@/screens/types";
import type { Playlist, RecommendationSection } from "@auralous/api";
import type { FC } from "react";
import { memo } from "react";
import type { ViewStyle } from "react-native";
import ExploreSection from "./ExploreSection";
import scrollStyles from "./ScrollView.styles";

const RecommendationItem = memo<{ playlist: Playlist; style: ViewStyle }>(
  function RecommendationItem({ playlist, style }) {
    return (
      <RNLink
        style={style}
        to={{
          screen: RouteName.Playlist,
          params: { id: playlist.id },
        }}
      >
        <PlaylistItem playlist={playlist} />
      </RNLink>
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

const RecommendationSectionSection: FC<{
  recommendation: RecommendationSection;
}> = ({ recommendation }) => {
  return (
    <ExploreSection
      title={recommendation.title}
      description={recommendation.description}
      href={`/explore/${recommendation.id}`}
    >
      <HorizontalList
        style={scrollStyles.scroll}
        contentContainerStyle={scrollStyles.scrollContent}
        data={recommendation.playlists}
        renderItem={renderItem}
        ListEmptyComponent={ResultEmptyScreen}
      />
    </ExploreSection>
  );
};

export default RecommendationSectionSection;
