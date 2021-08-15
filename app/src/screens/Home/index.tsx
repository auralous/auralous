import { ParamList, RouteName } from "@/screens/types";
import { Size } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "./components/AddButton";
import FeaturedPlaylists from "./components/FeaturedPlaylists";
import HeaderSection from "./components/Header";
import MapNavigate from "./components/MapNavigate";
import RecentStories from "./components/RecentStories";
import Section from "./components/Section";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Size[6],
    paddingVertical: Size[3],
  },
  root: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Size[2],
  },
});

const HomeScreen: FC<NativeStackScreenProps<ParamList, RouteName.Home>> =
  () => {
    const { t } = useTranslation();
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.scroll}>
          <HeaderSection />
          <View style={styles.content}>
            <Section title={t("home.featured_playlists.title")}>
              <FeaturedPlaylists />
            </Section>
            <MapNavigate />
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
          </View>
        </ScrollView>
        <AddButton />
      </SafeAreaView>
    );
  };

export default HomeScreen;
