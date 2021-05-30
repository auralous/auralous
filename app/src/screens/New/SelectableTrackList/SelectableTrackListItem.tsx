import { IconCheck, IconPlus } from "@/assets/svg";
import { TrackItem } from "@/components/Track";
import { useTrackQuery } from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SelectableTrackListProps } from "./types";

const styles = StyleSheet.create({
  item: {
    padding: Size[1],
    marginBottom: Size[1],
    flexDirection: "row",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
    paddingRight: Size[2],
    overflow: "hidden",
  },
  button: {
    width: Size[12],
    height: Size[12],
    alignItems: "center",
    justifyContent: "center",
  },
});

const SelectableTrackListItem: React.FC<
  Omit<SelectableTrackListProps, "selectedTracks"> & {
    trackId: string;
    selectedTracks: string[] | boolean;
  }
> = ({ trackId, selectedTracks, addTracks, removeTrack }) => {
  const [{ data, fetching }] = useTrackQuery({ variables: { id: trackId } });

  const selected = useMemo(
    () =>
      typeof selectedTracks === "boolean"
        ? selectedTracks
        : selectedTracks.indexOf(trackId) > -1,
    [trackId, selectedTracks]
  );

  const colors = useColors();

  return (
    <View style={[styles.item, selected && { opacity: 0.5 }]}>
      <View style={styles.itemContent}>
        <TrackItem track={data?.track || null} fetching={fetching} />
      </View>
      {!!addTracks && !!removeTrack && (
        <TouchableOpacity
          onPress={() =>
            !selected ? addTracks([trackId]) : removeTrack(trackId)
          }
          style={styles.button}
        >
          {selected ? (
            <IconCheck stroke={colors.text} />
          ) : (
            <IconPlus stroke={colors.text} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SelectableTrackListItem;
