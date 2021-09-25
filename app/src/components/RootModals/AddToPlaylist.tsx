import { SlideModal } from "@/components/Dialog";
import { LoadingScreen } from "@/components/Loading";
import { useUi, useUiDispatch } from "@/context";
import { Colors } from "@/styles/colors";
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
  const { addToPlaylist } = useUi();
  const uiDispatch = useUiDispatch();

  const [{ data }] = useTrackQuery({
    variables: { id: addToPlaylist.trackId || "" },
    pause: !addToPlaylist.trackId,
  });

  const onDismiss = useCallback(
    () => uiDispatch({ type: "addToPlaylist", value: { visible: false } }),
    [uiDispatch]
  );

  return (
    <SlideModal visible={addToPlaylist.visible} onDismiss={onDismiss}>
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
