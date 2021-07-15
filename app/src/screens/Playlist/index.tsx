import { PageHeaderGradient } from "@/components/Colors";
import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { usePlaylistQuery } from "@auralous/api";
import { HeaderBackable, LoadingScreen } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlaylistContent from "./PlaylistContent";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

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
    <SafeAreaView style={styles.root}>
      <PageHeaderGradient image={data?.playlist?.image} />
      <HeaderBackable onBack={navigation.goBack} title="" />
      {fetching ? (
        <LoadingScreen />
      ) : data?.playlist ? (
        <PlaylistContent playlist={data.playlist} />
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default PlaylistScreen;
