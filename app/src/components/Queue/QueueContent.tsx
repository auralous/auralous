import { Button } from "@/components/Button";
import type {
  SortableListRenderItem,
  SortableListRenderItemInfo,
} from "@/components/SortableFlatList";
import { SortableFlatList } from "@/components/SortableFlatList";
import { Spacer } from "@/components/Spacer";
import { QueueTrackItem, TrackItem } from "@/components/Track";
import { Heading, Text } from "@/components/Typography";
import type { PlaybackStateQueue } from "@/player";
import player, { usePreloadedTrackQueries } from "@/player";
import { Colors } from "@/styles/colors";
import { Font, fontPropsFn } from "@/styles/fonts";
import { Size } from "@/styles/spacing";
import type { QueueItem, Track } from "@auralous/api";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { QueueAdder } from "./QueueAdder";

const QueueContext = createContext(
  {} as {
    toggleSelected(uid: string): void;
    selected: Record<string, undefined | boolean>;
  }
);

const styles = StyleSheet.create({
  list: { flex: 1 },
  np: {
    height: Size[14],
    padding: Size[1],
    width: "100%",
  },
  root: {
    flex: 1,
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
});

const DraggableQueueItem = memo<{
  params: SortableListRenderItemInfo<QueueItem>;
}>(
  function DraggableQueueItem({ params }) {
    const onPress = useCallback((uid: string) => player.queuePlayUid(uid), []);

    const { toggleSelected, selected } = useContext(QueueContext);

    const onToggle = useCallback(
      () => toggleSelected(params.item.uid),
      [params.item.uid, toggleSelected]
    );

    const [{ data: dataTrack }] = useTrackQuery({
      variables: { id: params.item.trackId },
      requestPolicy: "cache-only", // we rely on data from usePreloadedTrackQueries
    });

    return (
      <QueueTrackItem
        track={dataTrack?.track || null}
        // FIXME: This is misleading if track is not found
        fetching={!dataTrack?.track}
        drag={params.drag}
        animStyle={params.animStyle}
        checked={!!selected[params.item.uid]}
        onToggle={onToggle}
        uid={params.item.uid}
        dragging={params.isDragging}
        onPress={onPress}
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

interface SelectedObject {
  [key: string]: undefined | boolean;
}

const extractUidsFromSelected = (selected: SelectedObject) => {
  return Object.keys(selected).filter((selectedKey) => !!selected[selectedKey]);
};
const itemHeight = Size[12] + Size[1] * 2 + Size[2];
const renderItem: SortableListRenderItem<QueueItem> = (params) => (
  <DraggableQueueItem key={params.item.uid} params={params} />
);
const keyExtractor = (item: QueueItem) => item.uid;
const ItemSeparatorComponent = () => <Spacer y={2} />;
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

const QueueContent: FC<{
  nextItems: PlaybackStateQueue["nextItems"];
  currentTrack: Track | null;
}> = ({ nextItems, currentTrack }) => {
  const { t } = useTranslation();

  // Store a temporary nextItems state
  // When the queue is updated, it takes awhile for
  // upstream nextItems to update. In those meantimes
  // we hold temporary items
  const [items, setItems] = useState<QueueItem[]>([]);

  // This util is used to avoid loading each individual track
  // in <DraggableQueueItem /> by batching them while checking against cache
  usePreloadedTrackQueries(
    useMemo(() => items.map((item) => item.trackId), [items])
  );

  // Whenever upstream queue updates
  // we reset everything to the original
  // nextItems value (clear "temp" items)
  useEffect(() => {
    setItems(nextItems);
  }, [nextItems]);

  const onDragEnd = useCallback((from: number, to: number) => {
    player.queueReorder(from, to);
  }, []);

  const [selected, setSelected] = useState<Record<string, undefined | boolean>>(
    {}
  );

  useEffect(() => {
    // Unselect removed item
    setSelected((selected) => {
      const obj: typeof selected = {};
      for (const item of items) {
        obj[item.uid] = selected[item.uid];
      }
      return obj;
    });
  }, [items]);

  const toggleSelected = useCallback(
    (uid: string) =>
      setSelected((selected) => ({ ...selected, [uid]: !selected[uid] })),
    []
  );

  const hasSelected = useMemo(
    () => Object.values(selected).includes(true),
    [selected]
  );

  const removeSelected = useCallback(() => {
    const removingUids = extractUidsFromSelected(selected);
    player.queueRemove(removingUids);
    // No need to update temp items because this does not
    // cause render flicker
  }, [selected]);

  const playNextSelected = useCallback(() => {
    const selectedClone = { ...selected };
    const toTopUids = extractUidsFromSelected(selected);
    for (const toTopUid of toTopUids) {
      delete selectedClone[toTopUid];
    }
    setSelected(selectedClone);
    player.queueToTop(toTopUids);
    // No need to update temp items because this does not
    // cause render flicker
  }, [selected]);

  const onAddTracks = useCallback((trackIds: string[]) => {
    player.queueAdd(trackIds);
  }, []);
  const onRemoveTracks = useCallback(
    (trackIds: string[]) => {
      const removingUids: string[] = [];
      items.forEach(
        (item) => trackIds.includes(item.trackId) && removingUids.push(item.uid)
      );
      player.queueRemove(removingUids);
    },
    [items]
  );

  const [addVisible, setAddVisible] = useState(false);
  const closeAdd = useCallback(() => setAddVisible(false), []);
  const openAdd = useCallback(() => setAddVisible(true), []);

  return (
    <QueueContext.Provider value={{ toggleSelected, selected }}>
      <View style={styles.root}>
        <Heading level={6}>{t("now_playing.title")}</Heading>
        <Spacer y={2} />
        <View style={styles.np}>
          {currentTrack ? (
            <TrackItem isPlaying track={currentTrack} />
          ) : (
            <>
              <Spacer y={4} />
              <Text align="left" bold color="textTertiary">
                {t("player.no_playing")}
              </Text>
            </>
          )}
        </View>
        <Spacer y={4} />
        <Heading level={6}>{t("queue.up_next")}</Heading>
        <Spacer y={2} />
        <SortableFlatList
          style={styles.list}
          ItemSeparatorComponent={ItemSeparatorComponent}
          data={items}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={0}
          removeClippedSubviews
          windowSize={10}
        />
        <Spacer y={1} />
        {hasSelected ? (
          <View style={styles.selectOpts}>
            <Button
              variant="text"
              onPress={removeSelected}
              textProps={{ style: styles.selectOptsText }}
            >
              {t("queue.remove")}
            </Button>
            <Button
              variant="text"
              onPress={playNextSelected}
              textProps={{ style: styles.selectOptsText }}
            >
              {t("queue.play_next")}
            </Button>
          </View>
        ) : (
          <Button onPress={openAdd}>{t("queue.add_songs")}</Button>
        )}
        <QueueAdder
          onAddTracks={onAddTracks}
          onRemoveTracks={onRemoveTracks}
          onClose={closeAdd}
          visible={addVisible}
          items={items}
        />
      </View>
    </QueueContext.Provider>
  );
};

export default QueueContent;
