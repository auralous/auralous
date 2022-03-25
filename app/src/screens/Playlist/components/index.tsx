import { useContainerStyle } from "@/components/Container";
import { LoadingScreen } from "@/components/Loading";
import { ResultEmptyScreen } from "@/components/Result";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import type { PlaybackStateQueue } from "@/player";
import player, {
  uidForIndexedTrack,
  useIsCurrentPlaybackSelection,
} from "@/player";
import { Size } from "@/styles/spacing";
import type { Playlist, Track } from "@auralous/api";
import { usePlaylistTracksQuery } from "@auralous/api";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import PlaylistMeta from "./PlaylistMeta";

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Size[3],
    paddingVertical: Size[1],
    width: "100%",
  },
  root: {
    flex: 1,
  },
});

const PlaylistTrackItem = memo<{
  track: Track;
  index: number;
  playlistId: string;
  isCurrentSelection: boolean;
}>(function PlaylistTrackItem({
  track,
  index,
  playlistId,
  isCurrentSelection,
}) {
  const onPress = useCallback(
    () =>
      player.playContext({
        id: ["playlist", playlistId],
        initialIndex: index,
        shuffle: false,
      }),
    [playlistId, index]
  );

  const uid = useMemo(
    () => uidForIndexedTrack(index, track.id),
    [index, track.id]
  );

  const [isCurrentUid, setIsCurrentUid] = useState(false);
  useEffect(() => {
    if (!isCurrentSelection) {
      setIsCurrentUid(false);
      return;
    }

    setIsCurrentUid(player.getState().queue.item?.uid === uid);

    const onStateQueue = (stateQueue: PlaybackStateQueue) => {
      setIsCurrentUid(stateQueue.item?.uid === uid);
    };
    player.on("state-queue", onStateQueue);
    return () => player.off("state-queue", onStateQueue);
  }, [uid, isCurrentSelection]);

  const isCurrentTrack = isCurrentSelection && isCurrentUid;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem isPlaying={isCurrentTrack} track={track} key={index} />
    </TouchableOpacity>
  );
});

const itemHeight = Size[12] + 2 * Size[1] + Size[2];
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});
const ItemSeparatorComponent = () => <Spacer y={2} />;

export const PlaylistScreenContent: FC<{
  playlist: Playlist;
  onQuickShare(playlist: Playlist): void;
}> = ({ playlist, onQuickShare }) => {
  const [{ data, fetching }] = usePlaylistTracksQuery({
    variables: {
      id: playlist.id,
    },
  });

  const containerStyle = useContainerStyle();

  const isCurrentSelection = useIsCurrentPlaybackSelection(
    "playlist",
    playlist.id
  );
  const renderItem = useCallback<ListRenderItem<Track>>(
    ({ item, index }) => {
      return (
        <PlaylistTrackItem
          key={index}
          playlistId={playlist.id}
          isCurrentSelection={isCurrentSelection}
          track={item}
          index={index}
        />
      );
    },
    [playlist.id, isCurrentSelection]
  );

  const ListHeaderComponent = useMemo(
    () => <PlaylistMeta onQuickShare={onQuickShare} playlist={playlist} />,
    [playlist, onQuickShare]
  );
  return (
    <View style={styles.root}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={containerStyle}
        data={data?.playlistTracks || []}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={0}
        removeClippedSubviews
        windowSize={10}
      />
    </View>
  );
};
