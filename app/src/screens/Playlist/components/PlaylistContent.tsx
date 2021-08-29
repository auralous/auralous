import type { Playlist, Track } from "@auralous/api";
import { usePlaylistTracksQuery } from "@auralous/api";
import player, {
  uidForIndexedTrack,
  usePlaybackCurrentContext,
  usePlaybackQueuePlayingId,
} from "@auralous/player";
import type { RecyclerRenderItem } from "@auralous/ui";
import { LoadingScreen, RecyclerList, Size, TrackItem } from "@auralous/ui";
import type { FC } from "react";
import { createContext, memo, useCallback, useContext, useMemo } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PlaylistMeta from "./PlaylistMeta";

const listPadding = Size[3];
const itemPadding = Size[1];

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: itemPadding,
    width: "100%",
  },
  listContent: {
    paddingBottom: Size[6],
    paddingHorizontal: listPadding,
    paddingTop: Size[3],
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
        id: playlistId,
        initialIndex: index,
        type: "playlist",
        shuffle: false,
      }),
    [playlistId, index]
  );

  const playbackCurrentContext = usePlaybackCurrentContext();
  const queuePlayingUid = usePlaybackQueuePlayingId();

  const isCurrentTrack = useMemo(
    () =>
      playbackCurrentContext?.type === "playlist" &&
      playbackCurrentContext.id === playlistId &&
      queuePlayingUid === uidForIndexedTrack(index, track.id),
    [queuePlayingUid, playbackCurrentContext, track.id, index, playlistId]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem isPlaying={isCurrentTrack} track={track} key={index} />
    </TouchableOpacity>
  );
});

const renderItem: RecyclerRenderItem<Track> = ({ item, index }) => {
  return <PlaylistTrackItem key={index} track={item} index={index} />;
};

const PlaylistContent: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const [{ data: dataPlaylist, fetching: fetchingTracks }] =
    usePlaylistTracksQuery({
      variables: {
        id: playlist.id,
      },
    });

  return (
    <PlaylistIdContext.Provider value={playlist.id}>
      <PlaylistMeta playlist={playlist} />
      <RecyclerList
        ListEmptyComponent={fetchingTracks ? <LoadingScreen /> : null}
        contentContainerStyle={styles.listContent}
        data={dataPlaylist?.playlistTracks || []}
        height={Size[12] + 2 * itemPadding + Size[3]} // height + 2 * padding + seperator
        renderItem={renderItem}
        contentHorizontalPadding={listPadding}
      />
    </PlaylistIdContext.Provider>
  );
};

export default PlaylistContent;
