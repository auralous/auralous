import { IconChevronLeft } from "@/assets";
import { Button } from "@/components/Button";
import { SlideModal } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { Colors } from "@/styles/colors";
import { SongSelector } from "@/views/SongSelector";
import type { QueueItem } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
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
  root: {
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
    <SafeAreaView style={styles.root}>
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

export const QueueAdder: FC<QueueAdderProps> = (props) => {
  return (
    <SlideModal visible={props.visible} onDismiss={props.onClose}>
      <QueueAdderContent {...props} />
    </SlideModal>
  );
};
