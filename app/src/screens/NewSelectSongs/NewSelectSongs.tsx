import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { SongSelector } from "@/views/SongSelector";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import type { Dispatch, FC, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  SelectedTracksListFooter,
  SelectedTracksListProvider,
  SelectedTracksListView,
} from "./components/SelectedTracksListView";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: Size[14],
  },
  sheet: {
    backgroundColor: Colors.backgroundSecondary,
  },
  sheetBottom: {
    backgroundColor: Colors.backgroundSecondary,
    paddingBottom: Size[2],
  },
});

const backdropComponent = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} pressBehavior="none" enableTouchThrough />
);

// topBar + footer heights + handleHeight
const snapPoints = [Size[10] + Size[12] + 24, "95%"];

const NewSelectSongs: FC<{
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

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} style={styles.sheetBottom}>
        <SelectedTracksListFooter
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
          onFinish={presentFinal}
        />
      </BottomSheetFooter>
    ),
    [presentFinal, selectedTracks, setSelectedTracks]
  );

  const [expanded, setExpanded] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    setExpanded(!!index);
  }, []);

  return (
    <>
      <SongSelector
        selectedTracks={selectedTracks}
        addTracks={addTracks}
        removeTracks={removeTracks}
      />
      <SelectedTracksListProvider expanded={expanded}>
        <BottomSheet
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          style={styles.sheet}
          handleIndicatorStyle={{ backgroundColor: Colors.textSecondary }}
          backgroundComponent={null}
          backdropComponent={backdropComponent}
          footerComponent={renderFooter}
        >
          <View style={styles.content}>
            <SelectedTracksListView
              selectedTracks={selectedTracks}
              setSelectedTracks={setSelectedTracks}
            />
          </View>
        </BottomSheet>
      </SelectedTracksListProvider>
    </>
  );
};

export default NewSelectSongs;
