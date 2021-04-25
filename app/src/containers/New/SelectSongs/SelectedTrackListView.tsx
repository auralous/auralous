import { IconChevronDown, IconChevronUp } from "@/assets/svg";
import {
  BottomSheetCustomBackdrop,
  BottomSheetCustomBackground,
} from "@/components/BottomSheet";
import { Button } from "@/components/Button";
import { Text } from "@/components/Typography";
import { Track, useTrackQuery } from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SelectableTrackListItem from "./SelectableTrackListItem";
import { TrackListProps } from "./types";

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

const LoadableSelectableTrackListItem: React.FC<
  {
    params: RenderItemParams<string>;
  } & Pick<TrackListProps, "addTracks" | "removeTrack">
> = ({ params, addTracks, removeTrack }) => {
  const [{ data }] = useTrackQuery({ variables: { id: params.item } });
  return (
    <TouchableWithoutFeedback
      style={[styles.flexFill, params.isActive && { opacity: 0.5 }]}
      onLongPress={params.drag}
    >
      <SelectableTrackListItem
        addTracks={addTracks}
        removeTrack={removeTrack}
        key={params.item}
        track={data?.track as Track}
        selectedTracks
      />
    </TouchableWithoutFeedback>
  );
};

const snapPoints = [cascadedHeight, "100%"];

const SelectedTrackListView: React.FC<
  TrackListProps & {
    setSelectedTracks(selectedTracks: string[]): void;
    onFinish(selectedTracks: string[]): void;
  }
> = ({
  selectedTracks,
  addTracks,
  removeTrack,
  setSelectedTracks,
  onFinish,
}) => {
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

  const renderItem = useCallback(
    (params: RenderItemParams<string>) => (
      <LoadableSelectableTrackListItem
        params={params}
        addTracks={addTracks}
        removeTrack={removeTrack}
        key={params.item}
      />
    ),
    [addTracks, removeTrack]
  );

  const colors = useColors();

  return (
    <>
      <View style={styles.placeholder} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={BottomSheetCustomBackdrop}
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
        <DraggableFlatList
          data={selectedTracks}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          onDragEnd={({ data }) => setSelectedTracks(data)}
          style={styles.flexFill}
        />
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
        >
          {t("new.select_songs.finish_add")}
        </Button>
      </View>
    </>
  );
};

export default SelectedTrackListView;