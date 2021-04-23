import { IconCheck, IconPlus } from "@/assets/svg";
import { TrackItem } from "@/components/Track";
import { Track } from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TrackListProps } from "./types";

const styles = StyleSheet.create({
  item: {
    padding: Size[2],
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
    paddingRight: Size[2],
    overflow: "hidden",
  },
});

const SelectableTrackListItem: React.FC<
  Omit<TrackListProps, "selectedTracks"> & {
    track: Track;
    selectedTracks: string[] | boolean;
  }
> = ({ track, selectedTracks, addTracks, removeTrack }) => {
  const selected = useMemo(
    () =>
      typeof selectedTracks === "boolean"
        ? selectedTracks
        : selectedTracks.indexOf(track.id) > -1,
    [track, selectedTracks]
  );

  const colors = useColors();

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <TrackItem track={track} />
      </View>
      <TouchableOpacity
        onPress={() =>
          !selected ? addTracks([track.id]) : removeTrack(track.id)
        }
      >
        {selected ? (
          <IconCheck stroke={colors.text} />
        ) : (
          <IconPlus stroke={colors.text} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SelectableTrackListItem;
