import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { ConstantSize } from "@/styles/spacing";
import type { Playlist } from "@auralous/api";
import { usePlaylistQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaylistScreenContent } from "./components";

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: ConstantSize.headerHeight },
});

const PlaylistScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Playlist>
> = ({ route, navigation }) => {
  const [{ data, fetching }] = usePlaylistQuery({
    variables: {
      id: route.params.id,
    },
  });

  const onQuickShare = useCallback(
    (playlist: Playlist) =>
      navigation.navigate(RouteName.NewQuickShare, { playlist }),
    [navigation]
  );

  useLayoutEffect(() => {
    if (data?.playlist?.name)
      navigation.setOptions({ title: data.playlist.name });
  }, [navigation, data?.playlist?.name]);

  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.playlist ? (
        <PlaylistScreenContent
          playlist={data.playlist}
          onQuickShare={onQuickShare}
        />
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default PlaylistScreen;
