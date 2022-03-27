import { LoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Size } from "@/styles/spacing";
import { useRecommendationSectionsQuery } from "@auralous/api";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ExploreSection from "./ExploreSection";
import RecentSessions from "./RecentSessions";
import RecommendationSectionSection from "./RecommendationSectionSection";
import SearchSection from "./SearchSection";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

const ExplorePlaylistRecommendations: FC = () => {
  const [{ data, fetching }] = useRecommendationSectionsQuery({
    variables: { playlistLimit: 10 },
  });
  if (fetching) return <LoadingScreen />;
  return (
    <>
      {data?.recommendationSections.map((recommendation) => (
        <RecommendationSectionSection
          key={recommendation.id}
          recommendation={recommendation}
        />
      ))}
    </>
  );
};

const ExploreScreenContent: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.content}>
      <SearchSection />
      <Spacer y={8} />
      <ExploreSection
        title={t("explore.recent_sessions.title")}
        description={t("explore.recent_sessions.description")}
        href="/sessions"
      >
        <RecentSessions />
      </ExploreSection>
      <ExploreSection
        title={t("explore.radio_stations.title")}
        description={t("explore.radio_stations.description")}
      ></ExploreSection>
      <ExplorePlaylistRecommendations />
    </View>
  );
};

export default ExploreScreenContent;
