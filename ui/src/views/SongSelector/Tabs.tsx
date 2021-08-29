import { Heading } from "@/components/Typography";
import { Size } from "@/styles";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface TabProps {
  title: string;
  active: boolean;
  onSelect(): void;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: Size[2],
  },
  tab: {
    paddingHorizontal: Size[2],
    paddingVertical: Size[2],
  },
  tabInactive: {
    opacity: 0.25,
  },
});

const Tab: FC<TabProps> = ({ title, active, onSelect }) => {
  return (
    <TouchableOpacity style={styles.tab} onPress={onSelect}>
      <Heading level={3} style={!active && styles.tabInactive}>
        {title}
      </Heading>
    </TouchableOpacity>
  );
};

const Tabs: FC<{
  tab: "songs" | "playlists";
  setTab(tab: "songs" | "playlists"): void;
}> = ({ tab, setTab }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Tab
        onSelect={() => setTab("songs")}
        active={tab === "songs"}
        title={t("select_songs.songs.title")}
      />
      <Tab
        onSelect={() => setTab("playlists")}
        active={tab === "playlists"}
        title={t("select_songs.playlists.title")}
      />
    </View>
  );
};

export default Tabs;
