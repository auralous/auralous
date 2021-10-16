import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ExploreSection from "./ExploreSection";
import FeaturedPlaylists from "./FeaturedPlaylists";
import RecentSessions from "./RecentSessions";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

const ExploreScreenContent: FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.content}>
      <ExploreSection title={t("explore.featured_playlists.title")}>
        <FeaturedPlaylists />
      </ExploreSection>
      <ExploreSection
        title={t("explore.recent_sessions.title")}
        description={t("explore.recent_sessions.description")}
      >
        <RecentSessions />
      </ExploreSection>
      <ExploreSection
        title={t("explore.radio_stations.title")}
        description={t("explore.radio_stations.description")}
      ></ExploreSection>
    </View>
  );
};

export default ExploreScreenContent;
