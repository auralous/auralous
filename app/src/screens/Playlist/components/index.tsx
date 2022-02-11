import { useContainerStyle } from "@/components/Container";
import { LoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import player, {
  uidForIndexedTrack,
  usePlaybackCurrentContext,
  usePlaybackQueuePlayingId,
} from "@/player";
import { Size } from "@/styles/spacing";
import type { Playlist, Track } from "@auralous/api";
import { usePlaylistTracksQuery } from "@auralous/api";
import type { FC } from "react";
import { createContext, memo, useCallback, useContext, useMemo } from "react";
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

const PlaylistIdContext = createContext("");

const PlaylistTrackItem = memo<{
  track: Track;
  index: number;
}>(function PlaylistTrackItem({ track, index }) {
  const playlistId = useContext(PlaylistIdContext);
  const onPress = useCallback(
    () =>
      player.playContext({
        id: ["playlist", playlistId],
        initialIndex: index,
        shuffle: false,
      }),
    [playlistId, index]
  );

  const playbackCurrentContext = usePlaybackCurrentContext();
  const queuePlayingUid = usePlaybackQueuePlayingId();

  const isCurrentTrack = useMemo(
    () =>
      playbackCurrentContext?.id?.[0] === "playlist" &&
      playbackCurrentContext.id[1] === playlistId &&
      queuePlayingUid === uidForIndexedTrack(index, track.id),
    [queuePlayingUid, playbackCurrentContext, track.id, index, playlistId]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem isPlaying={isCurrentTrack} track={track} key={index} />
    </TouchableOpacity>
  );
});

const renderItem: ListRenderItem<Track> = ({ item, index }) => {
  return <PlaylistTrackItem key={index} track={item} index={index} />;
};
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

  return (
    <View style={styles.root}>
      <PlaylistIdContext.Provider value={playlist.id}>
        <FlatList
          ListHeaderComponent={
            <PlaylistMeta onQuickShare={onQuickShare} playlist={playlist} />
          }
          ListEmptyComponent={fetching ? <LoadingScreen /> : undefined}
          ItemSeparatorComponent={ItemSeparatorComponent}
          contentContainerStyle={containerStyle}
          data={data?.playlistTracks || []}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={0}
          removeClippedSubviews
          windowSize={10}
        />
      </PlaylistIdContext.Provider>
    </View>
  );
};
