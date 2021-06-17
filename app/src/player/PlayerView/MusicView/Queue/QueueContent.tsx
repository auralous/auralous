import { IconMenu } from "@/assets/svg";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Heading, Text } from "@/components/Typography";
import { Maybe, QueueItem, Track, useTrackQuery } from "@/gql/gql.gen";
import { PlaybackState, player } from "@/player/Context";
import { Size, useColors } from "@/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import DraggableFlatList, {
  DragEndParams,
  OpacityDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import "react-native-gesture-handler";
import { QueueAdder } from "./QueueAdder";

const styles = StyleSheet.create({
  item: {
    padding: Size[1],
    marginBottom: Size[3],
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
  filled: {
    flex: 1,
  },
});

const TrackItemWrapper: React.FC<{ track: Maybe<Track>; drag?: () => void }> =
  ({ track, drag }) => {
    const colors = useColors();
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <TrackItem track={track} />
        </View>
        {drag && (
          <TouchableWithoutFeedback onLongPress={drag} style={styles.button}>
            <IconMenu stroke={colors.text} />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  };

const DraggableQueueItem: React.FC<{ params: RenderItemParams<QueueItem> }> = ({
  params: { item, drag },
}) => {
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: {
      id: item.trackId,
    },
  });
  return (
    <OpacityDecorator>
      <TrackItemWrapper track={track || null} drag={drag} />
    </OpacityDecorator>
  );
};

const renderItem = (params: RenderItemParams<QueueItem>) => (
  <DraggableQueueItem params={params} />
);

const keyExtractor = (item: QueueItem) => item.uid;

const QueueContent: React.FC<{
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

  const [addVisible, setAddVisible] = useState(false);

  const closeAdd = useCallback(() => setAddVisible(false), []);

  return (
    <View style={styles.filled}>
      <Heading level={6}>{t("now_playing.title")}</Heading>
      <Spacer y={2} />
      {currentTrack ? (
        <TrackItemWrapper track={currentTrack} />
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
      <Button onPress={() => setAddVisible(true)}>
        {t("queue.add_songs")}
      </Button>
      <QueueAdder onClose={closeAdd} visible={addVisible} items={items} />
    </View>
  );
};

export default QueueContent;
