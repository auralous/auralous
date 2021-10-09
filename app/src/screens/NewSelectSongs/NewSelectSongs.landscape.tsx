import { Container } from "@/components/Container";
import { Size } from "@/styles/spacing";
import { SongSelector } from "@/views/SongSelector";
import type { Dispatch, FC, SetStateAction } from "react";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import {
  SelectedTracksListFooter,
  SelectedTracksListProvider,
  SelectedTracksListView,
} from "./components/SelectedTracksListView";

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  root: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: Size[2],
  },
});

const NewSelectSongsLandscape: FC<{
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
  presentFinal(): void;
}> = ({ selectedTracks, setSelectedTracks, presentFinal }) => {
  const addTracks = useCallback(
    (trackIds: string[]) => {
      setSelectedTracks((prev) => [...prev, ...trackIds]);
    },
    [setSelectedTracks]
  );

  const removeTracks = useCallback(
    (trackIds: string[]) => {
      setSelectedTracks((prev) => prev.filter((t) => !trackIds.includes(t)));
    },
    [setSelectedTracks]
  );

  return (
    <Container style={styles.root}>
      <View style={styles.column}>
        <SongSelector
          selectedTracks={selectedTracks}
          addTracks={addTracks}
          removeTracks={removeTracks}
        />
      </View>
      <View style={styles.column}>
        <SelectedTracksListProvider expanded>
          <SelectedTracksListView
            selectedTracks={selectedTracks}
            setSelectedTracks={setSelectedTracks}
          />
          <SelectedTracksListFooter
            selectedTracks={selectedTracks}
            setSelectedTracks={setSelectedTracks}
            onFinish={presentFinal}
          />
        </SelectedTracksListProvider>
      </View>
    </Container>
  );
};

export default NewSelectSongsLandscape;
