import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    marginTop: Size[2],
  },
  tab: {
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    opacity: 0.6,
    padding: Size[1],
  },
  tabSelected: {
    borderBottomColor: Colors.primary,
    opacity: 1,
  },
});

const Tab: FC<{
  tab: "playlists" | "sessions";
  currentTab: "playlists" | "sessions";
  setTab: Dispatch<SetStateAction<"playlists" | "sessions">>;
  label: string;
}> = ({ tab, setTab, currentTab, label }) => {
  if (currentTab === tab)
    return (
      <Text style={[styles.tab, styles.tabSelected]} size="xl" bold>
        {label}
      </Text>
    );
  return (
    <TouchableOpacity onPress={() => setTab(tab)}>
      <Text style={styles.tab} size="xl" bold>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const Tabs: FC<{
  tab: "playlists" | "sessions";
  setTab: Dispatch<SetStateAction<"playlists" | "sessions">>;
}> = ({ tab, setTab }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <Tab
        tab="playlists"
        currentTab={tab}
        setTab={setTab}
        label={t("playlist.title")}
      />
      <Spacer x={4} />
      <Tab
        tab="sessions"
        currentTab={tab}
        setTab={setTab}
        label={t("session.title")}
      />
    </View>
  );
};

export default Tabs;
