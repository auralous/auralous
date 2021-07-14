import { Playlist, Track, usePlaylistTracksQuery } from "@auralous/api";
import player, { PlaybackContextType } from "@auralous/player";
import {
  LoadingScreen,
  RecyclerList,
  RecyclerRenderItem,
  Size,
  TrackItem,
} from "@auralous/ui";
import { createContext, FC, memo, useCallback, useContext } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PlaylistMeta from "./PlaylistMeta";

const listPadding = Size[3];
const itemPadding = Size[1];

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: listPadding,
    paddingTop: Size[3],
    paddingBottom: Size[6],
  },
  item: {
    padding: itemPadding,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
        type: PlaybackContextType.Playlist,
        shuffle: false,
      }),
    [playlistId, index]
  );
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem track={track} key={index} />
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
