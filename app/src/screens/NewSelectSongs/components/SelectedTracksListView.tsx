import { Button } from "@/components/Button";
import type {
  SortableListRenderItem,
  SortableListRenderItemInfo,
} from "@/components/SortableFlatList";
import { SortableFlatList } from "@/components/SortableFlatList";
import { QueueTrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import { reorder, shuffle } from "@/player";
import { Colors } from "@/styles/colors";
import { Font, fontPropsFn } from "@/styles/fonts";
import { Size } from "@/styles/spacing";
import { identityFn } from "@/utils/utils";
import type { SettabbleRef } from "@/views/SettableContext";
import {
  SettableProvider,
  useSettableContext,
  useSettableHas,
  useSettableNotEmpty,
} from "@/views/SettableContext";
import { useTrackQuery } from "@auralous/api";
import type { Dispatch, FC, SetStateAction } from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const paddingVertical = Size[1.5];

const styles = StyleSheet.create({
  footer: {
    height: Size[12],
    justifyContent: "center",
    paddingHorizontal: Size[3],
    width: "100%",
  },
  item: {
    paddingVertical,
  },
  list: { flex: 1 },
  listView: {
    flex: 1,
    paddingHorizontal: Size[3],
  },
  selectOpts: {
    borderColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Size[2],
  },
  selectOptsText: {
    ...fontPropsFn(Font.NotoSans, "medium"),
    textTransform: "uppercase",
  },
  shuffleButtonContainer: {
    alignItems: "flex-start",
    marginBottom: Size[1],
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[10],
    justifyContent: "space-between",
    paddingHorizontal: Size[1],
  },
});

export const SelectedTracksListProvider: FC<{
  expanded: boolean;
  invalidator: any;
}> = ({ children, expanded, invalidator }) => {
  const ref = useRef<SettabbleRef>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!expanded) {
      ref.current.set.clear();
      ref.current.emitter.emit("change");
    }
  }, [expanded]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.set.clear();
    ref.current.emitter.emit("change");
  }, [invalidator]);

  return <SettableProvider ref={ref}>{children}</SettableProvider>;
};

const SelectedQueueTrackItem = memo<{
  params: SortableListRenderItemInfo<string>;
}>(
  function SelectedQueueTrackItem({ params }) {
    const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
      variables: { id: params.item },
      // We know for sure that the track has been loaded
      // before being added as an queue item
      requestPolicy: "cache-only",
    });

    const checked = useSettableHas(params.item);
    const ctx = useSettableContext();

    const onToggle = useCallback(() => {
      if (ctx.set.has(params.item)) {
        ctx.set.delete(params.item);
      } else {
        ctx.set.add(params.item);
      }
      ctx.emitter.emit("change");
    }, [ctx, params.item]);

    return (
      <QueueTrackItem
        style={styles.item}
        checked={checked}
        drag={params.drag}
        animStyle={params.animStyle}
        dragging={params.isDragging}
        onToggle={onToggle}
        track={dataTrack?.track || null}
        fetching={fetchingTrack}
        uid={params.item} // not uid but not important
        hideImage
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.params.drag === nextProps.params.drag &&
      prevProps.params.item === prevProps.params.item
    );
  }
);

const renderItem: SortableListRenderItem<string> = (params) => (
  <SelectedQueueTrackItem
    params={params}
    key={`${params.index}${params.item}`}
  />
);

const itemHeight = Size[12] + 2 * paddingVertical; // height + 2 * padding
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

export const SelectedTracksListView: FC<{
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}> = ({ selectedTracks, setSelectedTracks }) => {
  const { t } = useTranslation();

  const onShuffle = useCallback(() => {
    setSelectedTracks((selectedTracks) => shuffle([...selectedTracks]));
  }, [setSelectedTracks]);

  const onDragEnd = useCallback(
    (from: number, to: number) => {
      setSelectedTracks((prev) => reorder(prev, from, to));
    },
    [setSelectedTracks]
  );

  return (
    <View style={styles.listView}>
      <View style={styles.topBar}>
        <Text color="textSecondary">
          {t("new.select_songs.num_selected", {
            count: selectedTracks.length,
          })}
        </Text>
      </View>
      <View style={styles.shuffleButtonContainer}>
        <Button onPress={onShuffle}>{t("new.select_songs.shuffle")}</Button>
      </View>
      <SortableFlatList
        style={styles.list}
        data={selectedTracks}
        renderItem={renderItem}
        onDragEnd={onDragEnd}
        keyExtractor={identityFn}
        getItemLayout={getItemLayout}
        initialNumToRender={0}
        removeClippedSubviews
        windowSize={10}
      />
    </View>
  );
};

export const SelectedTracksListFooter: FC<{
  onFinish(): void;
  selectedTracks: string[];
  setSelectedTracks: Dispatch<SetStateAction<string[]>>;
}> = ({ selectedTracks, setSelectedTracks, onFinish }) => {
  const { t } = useTranslation();

  const ctx = useSettableContext();

  const hasChecked = useSettableNotEmpty();

  const removeChecked = useCallback(() => {
    const removingUids = Array.from(ctx.set);
    setSelectedTracks((prev) => prev.filter((t) => !removingUids.includes(t)));
    // reset state after bottom action
    ctx.set.clear();
    ctx.emitter.emit("change");
  }, [setSelectedTracks, ctx]);

  const moveToTopChecked = useCallback(() => {
    const toTopUids = Array.from(ctx.set);
    setSelectedTracks((prev) => [
      ...prev.filter((t) => toTopUids.includes(t)),
      ...prev.filter((t) => !toTopUids.includes(t)),
    ]);
    // reset state after bottom action
    ctx.set.clear();
    ctx.emitter.emit("change");
  }, [setSelectedTracks, ctx]);

  return (
    <View style={styles.footer}>
      {hasChecked ? (
        <View style={styles.selectOpts}>
          <Button
            variant="text"
            onPress={removeChecked}
            textProps={{ style: styles.selectOptsText }}
          >
            {t("queue.remove")}
          </Button>
          <Button
            variant="text"
            onPress={moveToTopChecked}
            textProps={{ style: styles.selectOptsText }}
          >
            {t("queue.move_to_top")}
          </Button>
        </View>
      ) : (
        <Button
          disabled={selectedTracks.length === 0}
          variant="filled"
          onPress={onFinish}
        >
          {t("new.select_songs.finish_add")}
        </Button>
      )}
    </View>
  );
};
