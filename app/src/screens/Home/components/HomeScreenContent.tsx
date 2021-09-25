import { Container } from "@/components/Layout";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import FeaturedPlaylists from "./FeaturedPlaylists";
import HomeSection from "./HomeSection";
import RecentSessions from "./RecentSessions";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
});

export const HomeScreenContent: FC = () => {
  const { t } = useTranslation();
  return (
    <Container style={styles.content}>
      <HomeSection title={t("home.featured_playlists.title")}>
        <FeaturedPlaylists />
      </HomeSection>
      <HomeSection
        title={t("home.recent_sessions.title")}
        description={t("home.recent_sessions.description")}
      >
        <RecentSessions />
      </HomeSection>
      <HomeSection
        title={t("home.radio_stations.title")}
        description={t("home.radio_stations.description")}
      ></HomeSection>
    </Container>
  );
};
