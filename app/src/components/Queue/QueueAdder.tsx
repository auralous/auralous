import type { QueueItem } from "@auralous/api";
import {
  Button,
  Colors,
  Header,
  IconChevronLeft,
  SongSelector,
  useBackHandlerDismiss,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface QueueAdderProps {
  visible: boolean;
  onClose(): void;
  items: QueueItem[];
  onAddTracks: (trackIds: string[]) => void;
  onRemoveTracks: (trackIds: string[]) => void;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  sav: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
  },
});

const QueueAdderContent: FC<Omit<QueueAdderProps, "visible">> = ({
  onClose,
  items,
  onAddTracks,
  onRemoveTracks,
}) => {
  const { t } = useTranslation();
  const selectedTracks = useMemo(
    () => items.map((item) => item.trackId),
    [items]
  );

  return (
    <SafeAreaView style={styles.sav}>
      <Header
        left={
          <Button
            icon={<IconChevronLeft width={24} height={24} />}
            onPress={onClose}
            accessibilityLabel={t("common.navigation.go_back")}
          />
        }
        title={t("queue.add_songs")}
      />
      <View style={styles.content}>
        <SongSelector
          addTracks={onAddTracks}
          removeTracks={onRemoveTracks}
          selectedTracks={selectedTracks}
        />
      </View>
    </SafeAreaView>
  );
};

const snapPoints = ["100%"];

export const QueueAdder: FC<QueueAdderProps> = (props) => {
  const ref = useRef<BottomSheetModal>(null);
  useEffect(() => {
    if (props.visible) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  });

  useBackHandlerDismiss(props.visible, props.onClose);

  const onChange = useCallback(
    (index: number) => index === -1 && props.onClose(),
    [props]
  );

  return (
    <BottomSheetModal
      stackBehavior="push"
      onChange={onChange}
      ref={ref}
      handleComponent={null}
      snapPoints={snapPoints}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enablePanDownToClose={false}
    >
      <QueueAdderContent {...props} />
    </BottomSheetModal>
  );
};
