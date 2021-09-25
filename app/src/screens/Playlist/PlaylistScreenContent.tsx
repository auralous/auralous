import { Container } from "@/components/Layout";
import { LoadingScreen } from "@/components/Loading";
import type { RecyclerRenderItem } from "@/components/RecyclerList";
import { RecyclerList } from "@/components/RecyclerList";
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
import { StyleSheet, TouchableOpacity } from "react-native";
import PlaylistMeta from "./PlaylistMeta";

const itemPadding = Size[1];

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: itemPadding,
    paddingHorizontal: Size[3],
    width: "100%",
  },
  listContent: {
    paddingBottom: Size[6],
    paddingTop: Size[3],
  },
  root: { height: "100%" },
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

export const PlaylistScreenContent: FC<{
  playlist: Playlist;
  onQuickShare(playlist: Playlist): void;
}> = ({ playlist, onQuickShare }) => {
  const [{ data: dataPlaylist, fetching: fetchingTracks }] =
    usePlaylistTracksQuery({
      variables: {
        id: playlist.id,
      },
    });

  return (
    <Container style={styles.root}>
      <PlaylistIdContext.Provider value={playlist.id}>
        <PlaylistMeta playlist={playlist} onQuickShare={onQuickShare} />
        <RecyclerList
          ListEmptyComponent={fetchingTracks ? <LoadingScreen /> : null}
          contentContainerStyle={styles.listContent}
          data={dataPlaylist?.playlistTracks || []}
          height={Size[12] + 2 * itemPadding + Size[3]} // height + 2 * padding + seperator
          renderItem={renderItem}
        />
      </PlaylistIdContext.Provider>
    </Container>
  );
};
