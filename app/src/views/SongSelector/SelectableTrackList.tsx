import { IconCheck, IconPlus } from "@/assets";
import { LoadingScreen } from "@/components/Loading";
import { TrackItem } from "@/components/Track";
import { Size } from "@/styles/spacing";
import type { Track } from "@auralous/api";
import type { ListRenderItem } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import type { FC } from "react";
import { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSongSelectorContext } from "./Context";
import SearchEmpty from "./SearchEmpty";

const paddingVertical = Size[1.5];

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
    paddingVertical,
  },
  itemContent: {
    flex: 1,
    overflow: "hidden",
    paddingRight: Size[2],
  },
});

const SelectableTrackListItem: FC<{ track: Track }> = ({ track }) => {
  const songSelectorRef = useSongSelectorContext();

  const [selected, setSelected] = useState(() => songSelectorRef.has(track.id));

  useEffect(() => {
    const onChange = () => setSelected(songSelectorRef.has(track.id));
    songSelectorRef.emitter.on("change", onChange);
    return () => songSelectorRef.emitter.off("change", onChange);
  }, [track.id, songSelectorRef]);

  const toggleAdd = useCallback(() => {
    const trackIds = [track.id];
    if (selected) {
      songSelectorRef.remove(trackIds);
    } else {
      songSelectorRef.add(trackIds);
    }
  }, [selected, songSelectorRef, track.id]);

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <TrackItem track={track} />
      </View>
      <TouchableOpacity onPress={toggleAdd} style={styles.button}>
        {selected ? <IconCheck /> : <IconPlus />}
      </TouchableOpacity>
    </View>
  );
};

const MemoSelectableTrackListItem = memo(SelectableTrackListItem);

const itemHeight = Size[12] + 2 * paddingVertical;
const renderItem: ListRenderItem<Track> = ({ item }) => {
  return <MemoSelectableTrackListItem track={item} />;
};

const SelectableTrackList: FC<{
  fetching: boolean;
  data: Track[];
}> = ({ fetching, data }) => {
  return (
    <FlashList
      ListEmptyComponent={fetching ? LoadingScreen : SearchEmpty}
      data={data || []}
      renderItem={renderItem}
      estimatedItemSize={itemHeight}
    />
  );
};

export default SelectableTrackList;
