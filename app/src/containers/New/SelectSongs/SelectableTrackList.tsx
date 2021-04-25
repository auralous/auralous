import { LoadingBlock } from "@/components/Loading";
import { Track } from "@/gql/gql.gen";
import { commonStyles } from "@/styles/common";
import React, { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import SearchEmpty from "./SearchEmpty";
import SelectableTrackListItem from "./SelectableTrackListItem";
import { TrackListProps } from "./types";

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

const SelectableTrackList: React.FC<
  TrackListProps & { fetching: boolean; data: Track[] }
> = ({ selectedTracks, addTracks, removeTrack, fetching, data }) => {
  const renderItem = useCallback<ListRenderItem<Track>>(
    ({ item }) => (
      <SelectableTrackListItem
        selectedTracks={selectedTracks}
        addTracks={addTracks}
        removeTrack={removeTrack}
        key={item.id}
        track={item}
      />
    ),
    [addTracks, removeTrack, selectedTracks]
  );

  if (fetching)
    return (
      <View style={commonStyles.fillAndCentered}>
        <LoadingBlock />
      </View>
    );

  return (
    <>
      {data.length === 0 && <SearchEmpty />}
      <FlatList
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

export default SelectableTrackList;
