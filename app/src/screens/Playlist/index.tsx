import { IconMoreVertical, IconShare2 } from "@/assets";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { Config } from "@/config";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { ConstantSize } from "@/styles/spacing";
import { useUiDispatch } from "@/ui-context";
import type { Playlist } from "@auralous/api";
import { usePlaylistQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaylistScreenContent } from "./components";

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: ConstantSize.headerHeight },
});

const HeaderRight: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const { t } = useTranslation();

  const uiDispatch = useUiDispatch();

  return (
    <Button
      variant="text"
      icon={<IconMoreVertical width={21} height={21} />}
      accessibilityLabel={t("common.navigation.open_menu")}
      onPress={() => {
        uiDispatch({
          type: "contextMenu",
          value: {
            visible: true,
            title: playlist.name,
            subtitle: playlist.creatorName,
            image: playlist.image || undefined,
            items: [
              {
                icon: <IconShare2 stroke={Colors.textSecondary} />,
                text: t("share.share"),
                onPress() {
                  uiDispatch({
                    type: "share",
                    value: {
                      visible: true,
                      title: playlist.name,
                      url: `${Config.APP_URI}/playlist/${playlist.id}`,
                    },
                  });
                },
              },
            ],
          },
        });
      }}
    />
  );
};

const PlaylistScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.Playlist>
> = ({ route, navigation }) => {
  const [{ data, fetching }] = usePlaylistQuery({
    variables: {
      id: decodeURIComponent(route.params.id), // "decode the ':' character"
    },
  });

  const onQuickShare = useCallback(
    (playlist: Playlist) =>
      navigation.navigate(RouteName.NewQuickShare, { playlist }),
    [navigation]
  );

  useLayoutEffect(() => {
    const playlist = data?.playlist;
    if (!playlist) return;
    navigation.setOptions({
      title: playlist.name,
      headerRight() {
        return <HeaderRight playlist={playlist} />;
      },
    });
  }, [navigation, data]);

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
