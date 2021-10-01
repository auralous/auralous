import { Container } from "@/components/Layout";
import { renderLoadingScreen } from "@/components/Loading";
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
import type { BigListRenderItem } from "react-native-big-list";
import BigList from "react-native-big-list";
import PlaylistMeta from "./PlaylistMeta";

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: Size[1],
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

const renderItem: BigListRenderItem<Track> = ({ item, index }) => {
  return <PlaylistTrackItem key={index} track={item} index={index} />;
};

export const PlaylistScreenContent: FC<{
  playlist: Playlist;
  onQuickShare(playlist: Playlist): void;
}> = ({ playlist, onQuickShare }) => {
  const [{ data, fetching }] = usePlaylistTracksQuery({
    variables: {
      id: playlist.id,
    },
  });

  const renderHeader = useCallback(
    () => <PlaylistMeta onQuickShare={onQuickShare} playlist={playlist} />,
    [playlist, onQuickShare]
  );

  return (
    <Container style={styles.root}>
      <PlaylistIdContext.Provider value={playlist.id}>
        <BigList
          headerHeight={320}
          renderHeader={renderHeader}
          renderEmpty={fetching ? renderLoadingScreen : undefined}
          contentContainerStyle={styles.listContent}
          itemHeight={Size[12] + 2 * Size[1] + Size[2]} // height + 2 * padding + seperator
          data={data?.playlistTracks || []}
          renderItem={renderItem}
        />
      </PlaylistIdContext.Provider>
    </Container>
  );
};
