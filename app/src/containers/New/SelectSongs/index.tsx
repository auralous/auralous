import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Size } from "styles";
import Header from "./Header";
import SearchInput from "./SearchInput";
import SelectBySongs from "./SelectBySongs";
import SelectedTrackListView from "./SelectedTrackListView";
import Tabs from "./Tabs";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingTop: Size[2],
    paddingHorizontal: Size[6],
    flex: 1,
  },
});

const SelectSongs: React.FC<{ onFinish(selectedTracks: string[]): void }> = ({
  onFinish,
}) => {
  const [tab, setTab] = useState<"songs" | "playlists">("songs");
  const [search, setSearch] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const addTracks = useCallback(
    (trackIds: string[]) => setSelectedTracks((prev) => [...prev, ...trackIds]),
    []
  );
  const removeTrack = useCallback(
    (trackId: string) =>
      setSelectedTracks((prev) => prev.filter((t) => t !== trackId)),
    []
  );

  return (
    <View style={styles.root}>
      <Header />
      <Tabs tab={tab} setTab={setTab} />
      <SearchInput value={search} onSubmit={setSearch} />
      <View style={styles.content}>
        {tab === "songs" ? (
          <SelectBySongs
            search={search}
            selectedTracks={selectedTracks}
            addTracks={addTracks}
            removeTrack={removeTrack}
          />
        ) : null}
      </View>
      <SelectedTrackListView
        addTracks={addTracks}
        removeTrack={removeTrack}
        selectedTracks={selectedTracks}
        setSelectedTracks={setSelectedTracks}
        onFinish={onFinish}
      />
    </View>
  );
};

export default SelectSongs;
