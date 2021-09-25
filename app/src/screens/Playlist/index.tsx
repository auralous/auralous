import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import type { Playlist } from "@auralous/api";
import { usePlaylistQuery } from "@auralous/api";
import {
  LoadingScreen,
  PageHeaderGradient,
  PlaylistScreenContent,
} from "@auralous/ui";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  root: { flex: 1 },
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

  return (
    <SafeAreaView style={styles.root}>
      <PageHeaderGradient image={data?.playlist?.image} />
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
