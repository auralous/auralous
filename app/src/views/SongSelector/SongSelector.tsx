import { Tab, TabList, TabPanel, Tabs } from "@/components/Tab";
import { Size } from "@/styles/spacing";
import mitt from "mitt";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { SongSelectorRef, SongSelectorState } from "./Context";
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

  // TODO: this implementation improves performance but makes the assumption
  // that tracks are always added/removed successfully
  const [selectorRef] = useState<SongSelectorRef>(() => ({
    emitter: mitt(),
    has(trackId) {
      return props.selectedTracks.includes(trackId);
    },
    add: props.addTracks,
    remove: props.removeTracks,
  }));

  useEffect(() => {
    selectorRef.has = (trackId) => props.selectedTracks.includes(trackId);
    selectorRef.emitter.emit("change");
  }, [props.selectedTracks, selectorRef]);

  useEffect(() => {
    selectorRef.add = props.addTracks;
    selectorRef.remove = props.removeTracks;
  }, [props.addTracks, props.removeTracks, selectorRef]);

  return (
    <SongSelectorContext.Provider value={selectorRef}>
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
