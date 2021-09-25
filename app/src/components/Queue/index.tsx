import type { Track } from "@auralous/api";
import type { PlaybackState } from "@auralous/player";
import {
  Colors,
  Heading,
  IconChevronLeft,
  Size,
  SlideModal,
  Spacer,
  useBackHandlerDismiss,
  useDialog,
} from "@auralous/ui";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MetaAndButton from "./MetaAndButton";
import QueueContent from "./QueueContent";

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    alignItems: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[4],
  },
  headerSide: {
    alignItems: "center",
    flexDirection: "row",
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: Size[4],
  },
});

const QueueSheet: FC<{
  nextItems: PlaybackState["nextItems"];
  currentTrack: Track | null;
  onClose(): void;
}> = ({ onClose, nextItems, currentTrack }) => {
  const { t } = useTranslation();

  useBackHandlerDismiss(true, onClose);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity
            accessibilityLabel={t("common.navigation.go_back")}
            onPress={onClose}
          >
            <IconChevronLeft width={Size[10]} height={Size[10]} />
          </TouchableOpacity>
          <Spacer x={1} />
          <Heading level={3}>{t("queue.title")}</Heading>
        </View>
        <View style={styles.headerSide}></View>
      </View>
      <View style={styles.content}>
        <QueueContent currentTrack={currentTrack} nextItems={nextItems} />
      </View>
    </SafeAreaView>
  );
};

export const QueueModal: FC<{
  nextItems: PlaybackState["nextItems"];
  currentTrack: Track | null;
}> = ({ nextItems, currentTrack }) => {
  const [visible, present, dismiss] = useDialog();

  return (
    <>
      <MetaAndButton nextItems={nextItems} onPress={present} />
      <SlideModal visible={visible} onDismiss={dismiss}>
        <QueueSheet
          currentTrack={currentTrack}
          nextItems={nextItems}
          onClose={dismiss}
        />
      </SlideModal>
    </>
  );
};
