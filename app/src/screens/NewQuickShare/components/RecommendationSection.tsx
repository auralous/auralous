import type { Playlist, RecommendationSection } from "@auralous/api";
import type { FC } from "react";
import PlaylistsSection from "./PlaylistsSection";

const RecommendationPlaylistsSection: FC<{
  recommendation: RecommendationSection;
  onSelect(playlist: Playlist, fromRoute?: boolean): Promise<void>;
}> = ({ recommendation, onSelect }) => {
  return (
    <PlaylistsSection
      title={recommendation.title}
      playlists={recommendation?.playlists || []}
      onSelect={onSelect}
    />
  );
};

export default RecommendationPlaylistsSection;
