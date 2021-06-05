import { IconChevronDown, IconChevronUp } from "@/assets/svg";
import { BottomSheetCustomBackground } from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Text } from "@/components/Typography";
import { Size, useColors } from "@/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { SelectableTrackListItem } from "../SelectableTrackList";
import {
  useSelectedTracks,
  useUpdateTracks,
} from "../SelectableTrackList/Context";

const cascadedHeight = 112;

const styles = StyleSheet.create({
  placeholder: {
    height: cascadedHeight,
  },
  root: {
    paddingHorizontal: Size[3],
    paddingTop: Size[4],
    paddingBottom: Size[16],
  },
  metaBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Size[4],
    paddingHorizontal: Size[1],
  },
  flexFill: {
    flex: 1,
  },
  toggleExpand: {
    padding: Size[1],
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: Size[3],
    height: Size[16],
    justifyContent: "center",
    width: "100%",
  },
});

const snapPoints = [cascadedHeight, "100%"];

const renderItem = (params: RenderItemParams<string>) => {
  return (
    <ScaleDecorator>
      <TouchableWithoutFeedback onLongPress={params.drag}>
        <SelectableTrackListItem key={params.item} trackId={params.item} />
      </TouchableWithoutFeedback>
    </ScaleDecorator>
  );
};

const SelectedTrackListView: React.FC<{
  onFinish(selectedTracks: string[]): void;
}> = ({ onFinish }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [expanded, setExpanded] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    setExpanded(!!index);
  }, []);

  const { t } = useTranslation();

  const toggle = useCallback(
    () => bottomSheetRef.current?.snapTo(expanded ? 0 : 1),
    [expanded]
  );

  const selectedTracks = useSelectedTracks();
  const updateTracksActions = useUpdateTracks();

  const colors = useColors();

  return (
    <>
      <View style={styles.placeholder} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundComponent={BottomSheetCustomBackground}
        handleComponent={null}
        style={styles.root}
      >
        <View style={styles.metaBar}>
          <Text color="textSecondary">
            {t("new.select_songs.num_selected", {
              count: selectedTracks.length,
            })}
          </Text>
          <TouchableOpacity onPress={toggle} style={styles.toggleExpand}>
            {expanded ? (
              <IconChevronDown stroke={colors.textSecondary} />
            ) : (
              <IconChevronUp stroke={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.flexFill}>
          <DraggableFlatList
            data={selectedTracks}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            onDragEnd={({ data }) =>
              updateTracksActions?.setSelectedTracks(data)
            }
            windowSize={3}
          />
        </View>
      </BottomSheet>
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Button
          onPress={() => onFinish(selectedTracks)}
          disabled={selectedTracks.length === 0}
          variant="filled"
        >
          {t("new.select_songs.finish_add")}
        </Button>
      </View>
    </>
  );
};

export default SelectedTrackListView;
