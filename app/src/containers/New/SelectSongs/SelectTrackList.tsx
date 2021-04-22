import { LoadingBlock } from "components/Loading";
import { Track } from "gql/gql.gen";
import React, { useCallback } from "react";
import { ListRenderItem, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SelectTrackListItem from "./SelectTrackListItem";
import { TrackListProps } from "./types";

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const SelectTrackList: React.FC<
  TrackListProps & { fetching: boolean; data: Track[] }
> = ({ selectedTracks, addTracks, removeTrack, fetching, data }) => {
  const renderItem = useCallback<ListRenderItem<Track>>(
    ({ item }) => (
      <SelectTrackListItem
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
      <View style={styles.loading}>
        <LoadingBlock />
      </View>
    );

  return <FlatList data={data} renderItem={renderItem} />;
};

export default SelectTrackList;
