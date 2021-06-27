import { Track } from "@auralous/api";
import { LoadingBlock } from "@auralous/ui/components/Loading";
import { FC } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import SearchEmpty from "./SearchEmpty";
import SelectableTrackListItem, {
  getItemLayout,
} from "./SelectableTrackListItem";

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  full: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

const SelectableTrackList: FC<{
  fetching: boolean;
  data: (Track | string)[];
}> = ({ fetching, data }) => {
  if (fetching) {
    return (
      <View style={styles.full}>
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
        getItemLayout={getItemLayout}
      />
    </>
  );
};

export default SelectableTrackList;
