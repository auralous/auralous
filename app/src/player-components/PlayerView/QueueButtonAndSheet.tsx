import { IconChevronLeft, IconList } from "@/assets";
import { Button } from "@/components/Button";
import {
  SlideModal,
  useBackHandlerDismiss,
  useDialog,
} from "@/components/Dialog";
import QueueContent from "@/components/Queue/QueueContent";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import type { PlaybackState } from "@/player";
import { usePlaybackNextItems, usePlaybackTrackId } from "@/player";
import { Size } from "@/styles/spacing";
import type { Track } from "@auralous/api";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./QueueSheet.styles";

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

const GHQueueSheet = gestureHandlerRootHOC(QueueSheet);

const QueueButtonAndSheet = () => {
  const { t } = useTranslation();
  const [visible, present, dismiss] = useDialog();

  const nextItems = usePlaybackNextItems();
  const trackId = usePlaybackTrackId();
  const currentTrack =
    useTrackQuery({
      variables: { id: trackId as string },
      pause: !trackId,
    })[0].data?.track || null;

  return (
    <>
      <Button
        accessibilityLabel={t("queue.up_next")}
        onPress={present}
        icon={<IconList />}
        variant="text"
        style={styles.btn}
      />
      <SlideModal visible={visible} onDismiss={dismiss}>
        <GHQueueSheet
          currentTrack={currentTrack}
          nextItems={nextItems}
          onClose={dismiss}
        />
      </SlideModal>
    </>
  );
};

export default QueueButtonAndSheet;
