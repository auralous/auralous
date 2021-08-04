import { IconCheck, IconPlus } from "@/assets";
import { LoadingScreen } from "@/components/Loading";
import { RecyclerList, RecyclerRenderItem } from "@/components/RecyclerList";
import { TrackItem } from "@/components/Track";
import { Size } from "@/styles";
import { Track } from "@auralous/api";
import { FC, memo, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelectedTracks, useUpdateTracks } from "./Context";
import SearchEmpty from "./SearchEmpty";

const itemPadding = Size[1];

const styles = StyleSheet.create({
  item: {
    padding: itemPadding,
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

const renderItem: RecyclerRenderItem<Track> = ({ item, index }) => {
  return (
    <MemoSelectableTrackListItem key={`${index}${item.id}`} track={item} />
  );
};

const SelectableTrackList: FC<{
  fetching: boolean;
  data: Track[];
}> = ({ fetching, data }) => {
  return (
    <RecyclerList
      ListEmptyComponent={fetching ? <LoadingScreen /> : <SearchEmpty />}
      data={data}
      height={Size[12] + itemPadding * 2 + Size[3]} // height + 2 * padding + seperator
      renderItem={renderItem}
    />
  );
};

export default SelectableTrackList;
