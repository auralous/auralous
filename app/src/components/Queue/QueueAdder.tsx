import { IconChevronLeft } from "@/assets/svg";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { SongSelector } from "@/components/SongSelector";
import { QueueItem } from "@/gql/gql.gen";
import { useColors } from "@/styles";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

interface QueueAdderProps {
  visible: boolean;
  onClose(): void;
  items: QueueItem[];
}

const QueueAdderContent = gestureHandlerRootHOC(function QueueAdderContent({
  onClose,
  items,
}) {
  const { t } = useTranslation();
  const selectedTracks = useMemo(
    () => items.map((item) => item.trackId),
    [items]
  );

  const colors = useColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
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
        <SongSelector selectedTracks={selectedTracks} />
      </View>
    </View>
  );
} as React.FC<Omit<QueueAdderProps, "visible">>);

export const QueueAdder: React.FC<QueueAdderProps> = ({
  visible,
  onClose,
  items,
}) => {
  return (
    <Modal onRequestClose={onClose} visible={visible} animationType="fade">
      <QueueAdderContent onClose={onClose} items={items} />
    </Modal>
  );
};
