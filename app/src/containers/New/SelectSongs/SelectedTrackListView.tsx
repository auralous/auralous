import { IconChevronDown, IconChevronUp } from "@/assets/svg";
import { Button } from "@/components/Button";
import { Text } from "@/components/Typography";
import { Track, useTrackQuery } from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SelectableTrackListItem from "./SelectableTrackListItem";
import { TrackListProps } from "./types";

const cascadedHeight = 112;

const styles = StyleSheet.create({
  placeholder: {
    height: cascadedHeight,
  },
  root: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: Size[3],
    paddingVertical: Size[4],
    borderTopWidth: 2,
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
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const sharedExpanded = useSharedValue(false);

  const toggle = useCallback(() => setExpanded((expanded) => !expanded), []);

  useEffect(() => {
    sharedExpanded.value = expanded;
  }, [expanded, sharedExpanded]);

  const windowHeight = useWindowDimensions().height;

  const colors = useColors();

  const animatedStyles = useAnimatedStyle(() => ({
    height: withTiming(
      sharedExpanded.value
        ? windowHeight - (StatusBar.currentHeight || 20)
        : cascadedHeight,
      { duration: 250 }
    ),
  }));

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

  return (
    <>
      <View style={styles.placeholder} />
      <Animated.View
        style={[
          styles.root,
          animatedStyles,
          {
            backgroundColor: colors.backgroundSecondary,
            borderTopColor: colors.outline,
          },
        ]}
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
        <Button
          onPress={() => onFinish(selectedTracks)}
          disabled={selectedTracks.length === 0}
          color="primary"
        >
          {t("new.select_songs.finish_add")}
        </Button>
      </Animated.View>
    </>
  );
};

export default SelectedTrackListView;
