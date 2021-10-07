import { Button } from "@/components/Button";
import { SlideModal } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
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
  button: {
    marginTop: Size[2],
  },
  content: {
    flex: 1,
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: Size[4],
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
      <Header title={t("queue.add_songs")} />
      <View style={styles.content}>
        <SongSelector
          addTracks={onAddTracks}
          removeTracks={onRemoveTracks}
          selectedTracks={selectedTracks}
        />
      </View>
      <Button onPress={onClose} style={styles.button} variant="primary">
        {t("common.action.done")}
      </Button>
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
