import { Heading, Text } from "components/Typography";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Size } from "styles";
import { useTranslation } from "utils/i18n";
import FeaturedPlaylists from "./FeaturedPlaylists";
import FriendsPlaylists from "./FriendsPlaylists";
import Header from "./Header";
import RecentStories from "./RecentStories";

interface SectionProps {
  title: string;
  description?: string;
}

const section = StyleSheet.create({
  root: {
    marginVertical: Size[3],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Size[2],
  },
});

const Section: React.FC<SectionProps> = ({ title, description, children }) => {
  return (
    <View style={section.root}>
      <View style={section.header}>
        <View>
          <Heading level={6}>{title}</Heading>
          {Boolean(description) && (
            <Text color="textSecondary">{description}</Text>
          )}
        </View>
        <View></View>
      </View>
      <View>{children}</View>
    </View>
  );
};

const container = StyleSheet.create({
  root: {
    paddingVertical: Size[8],
    paddingHorizontal: Size[6],
  },
});

const Container: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ScrollView style={container.root}>
      <Header />
      <Section title={t("home.featured_playlists.title")}>
        <FeaturedPlaylists />
      </Section>
      <Section
        title={t("home.friends_playlists.title")}
        description={t("home.friends_playlists.description")}
      >
        <FriendsPlaylists />
      </Section>
      <Section
        title={t("home.recent_stories.title")}
        description={t("home.recent_stories.description")}
      >
        <RecentStories />
      </Section>
      <Section
        title={t("home.radio_stations.title")}
        description={t("home.radio_stations.description")}
      ></Section>
    </ScrollView>
  );
};

export default Container;
