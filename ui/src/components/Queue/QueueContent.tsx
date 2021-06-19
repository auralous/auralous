import { Button, TextButton } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { QueueTrackItem, TrackItem } from "@/components/Track";
import { Heading, Text } from "@/components/Typography";
import { Font, Size, useColors } from "@/styles";
import { QueueItem, Track, useTrackQuery } from "@auralous/api";
import player, { PlaybackState } from "@auralous/player";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import DraggableFlatList, {
  DragEndParams,
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import "react-native-gesture-handler";
import { QueueAdder } from "./QueueAdder";

const QueueContext = createContext(
  {} as {
    toggleSelected(uid: string): void;
    selected: Record<string, undefined | boolean>;
  }
);

const styles = StyleSheet.create({
  filled: {
    flex: 1,
  },
  np: {
    width: "100%",
    padding: Size[1],
  },
  selectOpts: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Size[2],
  },
  selectOptsText: {
    fontFamily: Font.Medium,
    textTransform: "uppercase",
  },
});

const DraggableQueueItem: FC<{ params: RenderItemParams<QueueItem> }> = ({
  params: { item, drag },
}) => {
  const [{ data, fetching }] = useTrackQuery({
    variables: {
      id: item.trackId,
    },
  });

  const { toggleSelected, selected } = useContext(QueueContext);

  return (
    <OpacityDecorator>
      <QueueTrackItem
        track={data?.track || null}
        fetching={fetching}
        drag={drag}
        checked={!!selected[item.uid]}
        onToggle={() => toggleSelected(item.uid)}
      />
    </OpacityDecorator>
  );
};

const renderItem = (params: RenderItemParams<QueueItem>) => (
  <DraggableQueueItem params={params} />
);

const keyExtractor = (item: QueueItem) => item.uid;

interface SelectedObject {
  [key: string]: undefined | boolean;
}

const extractUidsFromSelected = (selected: SelectedObject) => {
  return Object.keys(selected).filter((selectedKey) => !!selected[selectedKey]);
};

const QueueContent: FC<{
  playbackState: PlaybackState;
  currentTrack: Track | null;
}> = ({ playbackState, currentTrack }) => {
  const { t } = useTranslation();

  // Store a temporary nextItems state
  // When the queue is updated, it takes awhile for
  // upstream nextItems to update. In those meantimes
  // we hold temporary items
  const [items, setItems] = useState<QueueItem[]>([]);

  // Whenever upstream queue updates
  // we reset everything to the original
  // nextItems value (clear "temp" items)
  useEffect(() => {
    setItems(playbackState.nextItems);
  }, [playbackState.nextItems]);

  const onDragEnd = useCallback((params: DragEndParams<QueueItem>) => {
    setItems(params.data);
    player.emit("queue-reorder", params.from, params.to, params.data);
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
    setItems((items) =>
      items.filter((item) => !removingUids.includes(item.uid))
    );
    player.emit("queue-remove", removingUids);
  }, [selected]);

  const playNextSelected = useCallback(() => {
    const selectedClone = { ...selected };
    const toTopUids = extractUidsFromSelected(selected);
    for (const toTopUid of toTopUids) {
      delete selectedClone[toTopUid];
    }
    setSelected(selectedClone);
    player.emit("play-next", toTopUids);
    setItems((items) => {
      const nextItems: QueueItem[] = [];
      const afterItems = items.filter((item) => {
        if (toTopUids.includes(item.uid)) {
          nextItems.push(item);
          return false;
        }
        return true;
      });
      return [...nextItems, ...afterItems];
    });
  }, [selected]);

  const [addVisible, setAddVisible] = useState(false);

  const closeAdd = useCallback(() => setAddVisible(false), []);

  const colors = useColors();

  return (
    <QueueContext.Provider value={{ toggleSelected, selected }}>
      <View style={styles.filled}>
        <Heading level={6}>{t("now_playing.title")}</Heading>
        <Spacer y={2} />
        {currentTrack ? (
          <View style={styles.np}>
            <TrackItem track={currentTrack} />
          </View>
        ) : (
          <Text bold color="textTertiary" style={{ height: Size[12] }}>
            {t("player.no_playing")}
          </Text>
        )}
        <Spacer y={4} />
        <Heading level={6}>{t("queue.up_next")}</Heading>
        <Spacer y={2} />
        <View style={styles.filled}>
          <DraggableFlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onDragEnd={onDragEnd}
          />
        </View>
        <Spacer y={1} />
        {hasSelected ? (
          <View style={[styles.selectOpts, { borderColor: colors.border }]}>
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
          <Button onPress={() => setAddVisible(true)}>
            {t("queue.add_songs")}
          </Button>
        )}
        <QueueAdder onClose={closeAdd} visible={addVisible} items={items} />
      </View>
    </QueueContext.Provider>
  );
};

export default QueueContent;
