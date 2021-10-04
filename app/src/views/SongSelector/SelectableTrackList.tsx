import { IconCheck, IconPlus } from "@/assets";
import { LoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Size } from "@/styles/spacing";
import type { Track } from "@auralous/api";
import type { FC } from "react";
import { memo, useCallback, useMemo } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelectedTracks, useUpdateTracks } from "./Context";
import SearchEmpty from "./SearchEmpty";

const itemPadding = Size[1];

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    height: Size[12],
    justifyContent: "center",
    width: Size[12],
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: itemPadding,
  },
  itemContent: {
    flex: 1,
    overflow: "hidden",
    paddingRight: Size[2],
  },
});

const SelectableTrackListItem: FC<{ track: Track }> = ({ track }) => {
  const selectedTracks = useSelectedTracks();
  const updateTracksActions = useUpdateTracks();

  const selected = useMemo(
    () => selectedTracks.indexOf(track.id) > -1,
    [track, selectedTracks]
  );

  const toggleAdd = useCallback(() => {
    const trackIds = [track.id];
    return !selected
      ? updateTracksActions?.addTracks(trackIds)
      : updateTracksActions?.removeTracks(trackIds);
  }, [selected, updateTracksActions, track.id]);

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <TrackItem track={track} />
      </View>
      {updateTracksActions && (
        <TouchableOpacity onPress={toggleAdd} style={styles.button}>
          {selected ? <IconCheck /> : <IconPlus />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const MemoSelectableTrackListItem = memo(SelectableTrackListItem);

const itemHeight = Size[12] + 2 * itemPadding + Size[2];
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});
const renderItem: ListRenderItem<Track> = ({ item, index }) => {
  return (
    <MemoSelectableTrackListItem key={`${index}${item.id}`} track={item} />
  );
};
const ItemSeparatorComponent = () => <Spacer y={2} />;

const SelectableTrackList: FC<{
  fetching: boolean;
  data: Track[];
}> = ({ fetching, data }) => {
  return (
    <FlatList
      ListEmptyComponent={fetching ? <LoadingScreen /> : <SearchEmpty />}
      ItemSeparatorComponent={ItemSeparatorComponent}
      data={data || []}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={0}
      removeClippedSubviews
      windowSize={10}
    />
  );
};

export default SelectableTrackList;
