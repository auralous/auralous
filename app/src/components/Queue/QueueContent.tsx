import { usePreloadedTrackQueries } from "@/gql/track";
import { QueueItem, Track, useTrackQuery } from "@auralous/api";
import player, { PlaybackState } from "@auralous/player";
import {
  Button,
  Colors,
  DraggableRecyclerList,
  DraggableRecyclerRenderItemInfo,
  Font,
  Heading,
  QueueTrackItem,
  Size,
  Spacer,
  Text,
  TextButton,
  TrackItem,
} from "@auralous/ui";
import {
  createContext,
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import { QueueAdder } from "./QueueAdder";

const QueueContext = createContext(
  {} as {
    toggleSelected(uid: string): void;
    selected: Record<string, undefined | boolean>;
  }
);

const styles = StyleSheet.create({
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
    fontFamily: Font.Medium,
    textTransform: "uppercase",
  },
});

const DraggableQueueItem = memo<{
  params: DraggableRecyclerRenderItemInfo<QueueItem>;
}>(
  function DraggableQueueItem({ params }) {
    const onPress = useCallback((uid: string) => player.queuePlayUid(uid), []);

    const [{ data: dataTrack }] = useTrackQuery({
      variables: { id: params.item.trackId },
      requestPolicy: "cache-only", // we rely on data from usePreloadedTrackQueries
    });

    const { toggleSelected, selected } = useContext(QueueContext);

    const onToggle = useCallback(
      () => toggleSelected(params.item.uid),
      [params.item.uid, toggleSelected]
    );

    return (
      <QueueTrackItem
        track={dataTrack?.track || null}
        // FIXME: This is misleading if track is not found
        fetching={!dataTrack?.track}
        drag={params.drag}
        checked={!!selected[params.item.uid]}
        onToggle={onToggle}
        uid={params.item.uid}
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

const renderItem = (params: DraggableRecyclerRenderItemInfo<QueueItem>) => (
  <DraggableQueueItem key={params.item.uid} params={params} />
);

interface SelectedObject {
  [key: string]: undefined | boolean;
}

const extractUidsFromSelected = (selected: SelectedObject) => {
  return Object.keys(selected).filter((selectedKey) => !!selected[selectedKey]);
};

const keyExtractor = (item: QueueItem) => item.uid;

const QueueContent: FC<{
  nextItems: PlaybackState["nextItems"];
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
    player.playNext(toTopUids);
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
        <DraggableRecyclerList
          data={items}
          renderItem={renderItem}
          height={Size[12] + Size[2] + Size[3]} // height + 2 * padding + seperator
          onDragEnd={onDragEnd}
          keyExtractor={keyExtractor}
        />
        <Spacer y={1} />
        {hasSelected ? (
          <View style={styles.selectOpts}>
            <TextButton
              onPress={removeSelected}
              textProps={{ style: styles.selectOptsText }}
            >
              {t("queue.remove")}
            </TextButton>
            <TextButton
              onPress={playNextSelected}
              textProps={{ style: styles.selectOptsText }}
            >
              {t("queue.play_next")}
            </TextButton>
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
