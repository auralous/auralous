import { Size } from "@/styles";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { SongSelectorState } from "./Context";
import { SongSelectorContext } from "./Context";
import SearchInput from "./SearchInput";
import SelectByPlaylists from "./SelectByPlaylists";
import SelectBySongs from "./SelectBySongs";
import Tabs from "./Tabs";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Size[3],
    paddingBottom: 0,
  },
});

export const SongSelector: FC<SongSelectorState> = (props) => {
  const [tab, setTab] = useState<"songs" | "playlists">("songs");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [tab]);

  return (
    <SongSelectorContext.Provider value={props}>
      <Tabs tab={tab} setTab={setTab} />
      <SearchInput value={search} onSubmit={setSearch} />
      <View style={styles.content}>
        {tab === "songs" ? (
          <SelectBySongs search={search} />
        ) : (
          <SelectByPlaylists search={search} />
        )}
      </View>
    </SongSelectorContext.Provider>
  );
};
