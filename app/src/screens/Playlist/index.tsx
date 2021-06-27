import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  Playlist,
  Track,
  usePlaylistQuery,
  usePlaylistTracksQuery,
} from "@auralous/api";
import { HeaderBackable, Size, TrackItem } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import Meta from "./Meta";

const getItemLayout = (data: unknown, index: number) => ({
  length: Size[12] + 2 * Size[1],
  offset: Size[12] * index + Size[3] * index,
  index,
});

const styles = StyleSheet.create({
  list: {
    padding: Size[3],
  },
  header: {
    marginBottom: Size[3],
  },
  item: {
    padding: Size[1],
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Size[3],
  },
});

const renderItem: ListRenderItem<Track> = (params) => (
  <View style={styles.item}>
    <TrackItem track={params.item} key={params.index} />
  </View>
);

const Content: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const [{ data: dataPlaylist, fetching }] = usePlaylistTracksQuery({
    variables: {
      id: playlist.id,
    },
  });
  return (
    <FlatList
      style={styles.list}
      ListHeaderComponentStyle={styles.header}
      ListEmptyComponent={fetching && !dataPlaylist ? <LoadingScreen /> : null}
      data={dataPlaylist?.playlistTracks || []}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ListHeaderComponent={<Meta playlist={playlist} />}
    />
  );
};

const PlaylistScreen: FC<StackScreenProps<ParamList, RouteName.Playlist>> = ({
  route,
}) => {
  const [{ data, fetching }] = usePlaylistQuery({
    variables: {
      id: route.params.id,
    },
  });

  return (
    <>
      <HeaderBackable title="" />
      {fetching ? (
        <LoadingScreen />
      ) : data?.playlist ? (
        <Content playlist={data.playlist} />
      ) : (
        <NotFoundScreen />
      )}
    </>
  );
};

export default PlaylistScreen;
