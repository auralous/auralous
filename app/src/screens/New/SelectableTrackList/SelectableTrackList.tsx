import { LoadingBlock } from "@/components/Loading";
import { Track } from "@/gql/gql.gen";
import { commonStyles } from "@/styles/common";
import React, { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import SearchEmpty from "../SelectSongs/SearchEmpty";
import SelectableTrackListItem from "./SelectableTrackListItem";
import { SelectableTrackListProps } from "./types";

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

const trackIdFromTrackOrTrackId = (item: Track | string) =>
  typeof item === "string" ? item : item.id;

const SelectableTrackList: React.FC<
  SelectableTrackListProps & { fetching: boolean; data: (Track | string)[] }
> = ({ selectedTracks, addTracks, removeTrack, fetching, data }) => {
  const renderItem = useCallback<ListRenderItem<Track | string>>(
    ({ item }) => (
      <SelectableTrackListItem
        selectedTracks={selectedTracks}
        addTracks={addTracks}
        removeTrack={removeTrack}
        key={trackIdFromTrackOrTrackId(item)}
        trackId={trackIdFromTrackOrTrackId(item)}
      />
    ),
    [addTracks, removeTrack, selectedTracks]
  );

  if (fetching) {
    return (
      <View style={commonStyles.fillAndCentered}>
        <LoadingBlock />
      </View>
    );
  }

  return (
    <>
      {data.length === 0 && <SearchEmpty />}
      <FlatList
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={trackIdFromTrackOrTrackId}
      />
    </>
  );
};

export default SelectableTrackList;
