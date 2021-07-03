import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  Playlist,
  Track,
  usePlaylistQuery,
  usePlaylistTracksQuery,
} from "@auralous/api";
import { HeaderBackable, Size, Spacer, TrackItem } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import Meta from "./Meta";

const styles = StyleSheet.create({
  list: {
    padding: Size[3],
  },
  item: {
    padding: Size[1],
    flexDirection: "row",
    alignItems: "center",
  },
});

const renderItem: ListRenderItem<Track> = (params) => (
  <View style={styles.item}>
    <TrackItem track={params.item} key={params.index} />
  </View>
);

const ItemSeparatorComponent: FC = () => <Spacer y={3} />;

const Content: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const [{ data: dataPlaylist, fetching }] = usePlaylistTracksQuery({
    variables: {
      id: playlist.id,
    },
  });
  return (
    <FlatList
      style={styles.list}
      ListEmptyComponent={fetching && !dataPlaylist ? <LoadingScreen /> : null}
      data={dataPlaylist?.playlistTracks || []}
      renderItem={renderItem}
      ListHeaderComponent={<Meta playlist={playlist} />}
      removeClippedSubviews
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};

const PlaylistScreen: FC<StackScreenProps<ParamList, RouteName.Playlist>> = ({
  route,
  navigation,
}) => {
  const [{ data, fetching }] = usePlaylistQuery({
    variables: {
      id: route.params.id,
    },
  });

  return (
    <>
      <HeaderBackable onBack={navigation.goBack} title="" />
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
