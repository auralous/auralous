import { Tab, TabList, TabPanel, Tabs } from "@/components/Tab";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { SongSelectorState } from "./Context";
import { SongSelectorContext } from "./Context";
import SearchInput from "./SearchInput";
import SelectByPlaylists from "./SelectByPlaylists";
import SelectBySongs from "./SelectBySongs";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 0,
  },
  tabList: {
    justifyContent: "center",
    paddingVertical: Size[2],
  },
});

export const SongSelector: FC<SongSelectorState> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  return (
    <SongSelectorContext.Provider value={props}>
      <SearchInput value={search} onSubmit={setSearch} />
      <Tabs onChange={() => setSearch("")}>
        <TabList style={styles.tabList}>
          <Tab>{t("select_songs.songs.title")}</Tab>
          <Tab>{t("select_songs.playlists.title")}</Tab>
        </TabList>
        <TabPanel>
          <View style={styles.content}>
            <SelectBySongs search={search} />
          </View>
        </TabPanel>
        <TabPanel>
          <View style={styles.content}>
            <SelectByPlaylists search={search} />
          </View>
        </TabPanel>
      </Tabs>
    </SongSelectorContext.Provider>
  );
};
