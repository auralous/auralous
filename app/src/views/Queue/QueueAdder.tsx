import { Button } from "@/components/Button";
import { FadeModal } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import { SongSelector } from "@/views/SongSelector";
import type { QueueItem } from "@auralous/api";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
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
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Size[2],
    height: "100%",
    marginHorizontal: "auto",
    maxWidth: LayoutSize.lg,
    padding: Size[4],
    width: "100%",
  },
  content: {
    flex: 1,
  },
  root: {
    backgroundColor: "rgba(0,0,0,.4)",
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
      <KeyboardAvoidingView behavior="height" style={styles.container}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const QueueAdder: FC<QueueAdderProps> = (props) => {
  return (
    <FadeModal visible={props.visible} onDismiss={props.onClose}>
      <QueueAdderContent {...props} />
    </FadeModal>
  );
};
