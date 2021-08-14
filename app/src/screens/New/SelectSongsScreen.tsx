import { ParamList, RouteName } from "@/screens/types";
import { SongSelector, SongSelectorContext } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import SelectedTrackListView from "./components/SelectedTrackListView";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const SelectSongsScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.NewSelectSongs>
> = () => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const addTracks = useCallback((trackIds: string[]) => {
    setSelectedTracks((prev) => [...prev, ...trackIds]);
  }, []);

  const removeTracks = useCallback((trackIds: string[]) => {
    setSelectedTracks((prev) => prev.filter((t) => !trackIds.includes(t)));
  }, []);

  return (
    <View style={styles.root}>
      <SongSelector
        selectedTracks={selectedTracks}
        addTracks={addTracks}
        removeTracks={removeTracks}
      />
      <SongSelectorContext.Provider
        value={{ addTracks, removeTracks, selectedTracks }}
      >
        <SelectedTrackListView
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
        />
      </SongSelectorContext.Provider>
    </View>
  );
};

export default SelectSongsScreen;
