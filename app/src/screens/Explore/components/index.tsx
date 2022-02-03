import { LoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { Size } from "@/styles/spacing";
import { useRecommendationSectionsQuery } from "@auralous/api";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ExploreSection from "./ExploreSection";
import RecentSessions from "./RecentSessions";
import RecommendationSection from "./RecommendationSection";
import SearchSection from "./SearchSection";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

const ExploreScreenContent: FC = () => {
  const { t } = useTranslation();
  const [{ data, fetching }] = useRecommendationSectionsQuery();
  if (fetching) return <LoadingScreen />;
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
      {data?.recommendationSections.map((recommendation) => (
        <RecommendationSection
          key={recommendation.id}
          id={recommendation.id}
          title={recommendation.title}
          description={recommendation.description}
        />
      ))}
    </View>
  );
};

export default ExploreScreenContent;
