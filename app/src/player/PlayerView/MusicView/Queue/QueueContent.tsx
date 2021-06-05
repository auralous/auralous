import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Heading, Text } from "@/components/Typography";
import { Maybe, Queue, QueueItem, Track, useTrackQuery } from "@/gql/gql.gen";
import { PlaybackState } from "@/player/Context";
import Player from "@/player/Player";
import { Size } from "@/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import "react-native-gesture-handler";

const styles = StyleSheet.create({
  trackItemNumbered: {
    paddingVertical: Size[1],
    marginBottom: Size[1],
    paddingHorizontal: Size[4],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  filled: {
    flex: 1,
  },
});

const TrackItemWithNumber: React.FC<{ track: Maybe<Track>; index: number }> = ({
  track,
  index,
}) => {
  return (
    <View style={styles.trackItemNumbered}>
      <Text color="textSecondary" size="lg" bold="medium">
        {index + 1}
      </Text>
      <Spacer x={4} />
      <View style={styles.filled}>
        <TrackItem track={track} />
      </View>
    </View>
  );
};

const DraggableQueueItem: React.FC<RenderItemParams<QueueItem>> = ({
  item,
  index,
  drag,
}) => {
  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: {
      id: item.trackId,
    },
  });
  return (
    <TouchableOpacity onLongPress={drag}>
      <TrackItemWithNumber track={track || null} index={(index || 0) + 1} />
    </TouchableOpacity>
  );
};

const renderItem = (params: RenderItemParams<QueueItem>) => {
  return <DraggableQueueItem {...params} />;
};
const keyExtractor = (item: QueueItem) => item.trackId;

const QueueContent: React.FC<{
  playbackState: PlaybackState;
  currentTrack: Track | null;
  queue: Queue;
  player: Player;
}> = ({ playbackState, currentTrack, queue, player }) => {
  const { t } = useTranslation();
  const [trackItems, setTrackItems] = useState<QueueItem[]>([]);
  useEffect(() => {
    setTrackItems(queue?.items || []);
  }, [queue]);
  const onDragEnd = useCallback(
    (params: DragEndParams<QueueItem>) => {
      setTrackItems(params.data);
      player.emit("queue-reorder", params.from, params.to);
    },
    [player]
  );
  if (!playbackState.queue) return null;
  return (
    <View style={styles.filled}>
      <Heading level={6} color="textSecondary">
        {t("now_playing.title")}
      </Heading>
      <Spacer y={2} />
      {currentTrack ? (
        <TrackItemWithNumber track={currentTrack} index={0} />
      ) : (
        <Text>{t("player.no_playing")}</Text>
      )}
      <Spacer y={4} />
      <Heading level={6} color="textSecondary">
        {t("queue.up_next")}
      </Heading>
      <Spacer y={2} />
      <DraggableFlatList
        data={trackItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.filled}
        windowSize={3}
        onDragEnd={onDragEnd}
      />
    </View>
  );
};

export default QueueContent;
