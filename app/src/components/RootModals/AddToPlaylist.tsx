import { Dialog } from "@/components/Dialog";
import { LoadingScreen } from "@/components/Loading";
import { useUi, useUiDispatch } from "@/ui-context";
import { AddToPlaylist } from "@/views/AddToPlaylist";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  content: {
    height: 480,
    width: "100%",
  },
});

export const AddToPlaylistModal: FC = () => {
  const ui = useUi();
  const uiDispatch = useUiDispatch();

  const { t } = useTranslation();

  const [{ data }] = useTrackQuery({
    variables: { id: ui.addToPlaylist.trackId || "" },
    pause: !ui.addToPlaylist.trackId,
  });

  const onDismiss = useCallback(
    () => uiDispatch({ type: "addToPlaylist", value: { visible: false } }),
    [uiDispatch]
  );

  return (
    <Dialog.Dialog visible={ui.addToPlaylist.visible} onDismiss={onDismiss}>
      <Dialog.Title>{t("playlist_adder.title")}</Dialog.Title>
      <Dialog.Content>
        <View style={styles.content}>
          {data?.track ? (
            <AddToPlaylist onDismiss={onDismiss} track={data.track} />
          ) : (
            <LoadingScreen />
          )}
        </View>
      </Dialog.Content>
    </Dialog.Dialog>
  );
};
