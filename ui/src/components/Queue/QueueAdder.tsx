import { QueueItem } from "@auralous/api";
import { IconChevronLeft } from "@auralous/ui/assets";
import { Button } from "@auralous/ui/components/Button";
import { Header } from "@auralous/ui/components/Header";
import { SongSelector } from "@auralous/ui/components/SongSelector";
import { useColors } from "@auralous/ui/styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

interface QueueAdderProps {
  visible: boolean;
  onClose(): void;
  items: QueueItem[];
  onAddTracks: (trackIds: string[]) => void;
  onRemoveTracks: (trackIds: string[]) => void;
}

const QueueAdderContent = gestureHandlerRootHOC(
  ({
    onClose,
    items,
    onAddTracks,
    onRemoveTracks,
  }: Omit<QueueAdderProps, "visible">) => {
    const { t } = useTranslation();
    const selectedTracks = useMemo(
      () => items.map((item) => item.trackId),
      [items]
    );

    const colors = useColors();

    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}
      >
        <Header
          left={
            <Button
              icon={
                <IconChevronLeft stroke={colors.text} width={24} height={24} />
              }
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
  }
);

const snapPoints = ["100%"];

export const QueueAdder: FC<QueueAdderProps> = (props) => {
  const ref = useRef<BottomSheetModal>(null);
  useEffect(() => {
    if (props.visible) ref.current?.present();
    else ref.current?.dismiss();
  });
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
    >
      <QueueAdderContent {...props} />
    </BottomSheetModal>
  );
};
