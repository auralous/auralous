import { SlideModal } from "@/components/Dialog";
import { LoadingScreen } from "@/components/Loading";
import { Colors } from "@/styles/colors";
import { useUi, useUiDispatch } from "@/ui-context";
import { AddToPlaylist } from "@/views/AddToPlaylist";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});

export const AddToPlaylistModal: FC = () => {
  const ui = useUi();
  const uiDispatch = useUiDispatch();

  const [{ data }] = useTrackQuery({
    variables: { id: ui.addToPlaylist.trackId || "" },
    pause: !ui.addToPlaylist.trackId,
  });

  const onDismiss = useCallback(
    () => uiDispatch({ type: "addToPlaylist", value: { visible: false } }),
    [uiDispatch]
  );

  return (
    <SlideModal visible={ui.addToPlaylist.visible} onDismiss={onDismiss}>
      <SafeAreaView style={styles.content}>
        {data?.track ? (
          <AddToPlaylist onDismiss={onDismiss} track={data.track} />
        ) : (
          <LoadingScreen />
        )}
      </SafeAreaView>
    </SlideModal>
  );
};
