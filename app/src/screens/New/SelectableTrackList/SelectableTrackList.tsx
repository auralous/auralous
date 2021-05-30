import { LoadingBlock } from "@/components/Loading";
import { Track } from "@/gql/gql.gen";
import { commonStyles } from "@/styles/common";
import React from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import SearchEmpty from "../SelectSongs/SearchEmpty";
import SelectableTrackListItem from "./SelectableTrackListItem";

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

const trackIdFromTrackOrTrackId = (item: Track | string) =>
  typeof item === "string" ? item : item.id;

const renderItem: ListRenderItem<Track | string> = ({ item }) => {
  return (
    <SelectableTrackListItem
      key={trackIdFromTrackOrTrackId(item)}
      trackId={trackIdFromTrackOrTrackId(item)}
    />
  );
};

const SelectableTrackList: React.FC<{
  fetching: boolean;
  data: (Track | string)[];
}> = ({ fetching, data }) => {
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
        windowSize={2}
      />
    </>
  );
};

export default SelectableTrackList;
