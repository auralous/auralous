import { NavPlaceholder } from "@/components/Layout";
import { NotFoundScreen } from "@/components/NotFound";
import type { Playlist } from "@auralous/api";
import { usePlaylistQuery } from "@auralous/api";
import {
  LoadingScreen,
  PageHeaderGradient,
  PlaylistScreenContent,
} from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RouteComponentProps } from "react-router";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export const PlaylistScreen: FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const [{ data, fetching }] = usePlaylistQuery({
    variables: {
      id: match.params.id,
    },
  });

  const onQuickShare = useCallback(
    (playlist: Playlist) => history.push("/new/quick-share", { playlist }),
    [history]
  );

  return (
    <SafeAreaView style={styles.root}>
      <NavPlaceholder />
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
