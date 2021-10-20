import type { Playlist, RecommendationSection } from "@auralous/api";
import { useRecommendationContentQuery } from "@auralous/api";
import type { FC } from "react";
import PlaylistsSection from "./PlaylistsSection";

const RecommendationPlaylistsSection: FC<{
  recommendation: RecommendationSection;
  onSelect(playlist: Playlist, fromRoute?: boolean): Promise<void>;
}> = ({ recommendation, onSelect }) => {
  const [{ data }] = useRecommendationContentQuery({
    variables: {
      id: recommendation.id,
      limit: 10,
    },
  });

  return (
    <PlaylistsSection
      title={recommendation.title}
      playlists={data?.recommendationContent || []}
      onSelect={onSelect}
    />
  );
};

export default RecommendationPlaylistsSection;
