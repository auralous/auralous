import { useBackHandlerDismiss } from "@/components/BottomSheet/useBackHandlerDismiss";
import { Track } from "@auralous/api";
import { AddToPlaylist, Colors } from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  root: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});

const snapPoints = ["100%"];

const AddToPlaylistSheetInner: FC<{
  track: Track;
  onDismiss(): void;
}> = ({ track, onDismiss }) => {
  return (
    <SafeAreaView style={styles.content}>
      <AddToPlaylist onDismiss={onDismiss} track={track} />
    </SafeAreaView>
  );
};

const InnerWithHOC = gestureHandlerRootHOC(AddToPlaylistSheetInner);

export const AddToPlaylistSheet: FC<{
  value: AddToPlaylistContextValue;
  setValue: Dispatch<SetStateAction<AddToPlaylistContextValue>>;
}> = ({ value: track, setValue }) => {
  const ref = useRef<BottomSheetModal>(null);

  // This to maintain the UI to be the last track while the modal is closing
  const [lastTrack, setLastTrack] = useState<Track | null>(null);
  useEffect(() => {
    if (track) setLastTrack(track);
  }, [track]);

  useEffect(() => {
    if (track) ref.current?.present();
    else ref.current?.dismiss();
  }, [track]);

  const onDismiss = useCallback(() => setValue(null), [setValue]);

  useBackHandlerDismiss(!!track, onDismiss);

  return (
    <BottomSheetModal
      ref={ref}
      handleComponent={null}
      backgroundComponent={null}
      snapPoints={snapPoints}
      stackBehavior="push"
      style={styles.root}
      enableContentPanningGesture={false}
    >
      {lastTrack && <InnerWithHOC onDismiss={onDismiss} track={lastTrack} />}
    </BottomSheetModal>
  );
};

export type AddToPlaylistContextValue = Track | null;
