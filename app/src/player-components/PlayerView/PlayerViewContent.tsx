// Chat
import { IconChevronDown, IconList, IconMessageSquare } from "@/assets";
import {
  SlideModal,
  useBackHandlerDismiss,
  useDialog,
} from "@/components/Dialog";
import QueueContent from "@/components/Queue/QueueContent";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import type { PlaybackState } from "@/player";
import {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackNextItems,
  usePlaybackTrackId,
} from "@/player";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Track } from "@auralous/api";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatView from "./ChatView";
import MusicView from "./MusicView";

// common
const sheetStyles = StyleSheet.create({
  btn: {
    alignItems: "center",
    borderRadius: 9999,
    height: Size[10],
    justifyContent: "center",
    width: Size[10],
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Size[4],
  },
  root: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: Size[4],
  },
});

const SheetTitle: FC<{ title: string; onClose(): void }> = ({
  onClose,
  title,
}) => {
  const { t } = useTranslation();
  return (
    <View style={sheetStyles.header}>
      <Heading level={3}>{title}</Heading>
      <Spacer x={1} />
      <TouchableOpacity
        accessibilityLabel={t("common.navigation.go_back")}
        onPress={onClose}
      >
        <IconChevronDown width={Size[10]} height={Size[10]} />
      </TouchableOpacity>
    </View>
  );
};

// chat

const ChatSheet: FC<{
  onClose(): void;
}> = ({ onClose }) => {
  const { t } = useTranslation();
  const contextMeta = usePlaybackContextMeta(usePlaybackCurrentContext());
  return (
    <SafeAreaView style={sheetStyles.root}>
      <SheetTitle onClose={onClose} title={t("chat.title")} />
      <View style={sheetStyles.content}>
        <ChatView contextMeta={contextMeta} />
      </View>
    </SafeAreaView>
  );
};

const GHChatSheet = gestureHandlerRootHOC(ChatSheet);

const ChatButtonAndSheet: FC = () => {
  const { t } = useTranslation();
  const [visible, present, dismiss] = useDialog();

  return (
    <>
      <TouchableOpacity
        accessibilityLabel={t("chat.title")}
        onPress={present}
        style={sheetStyles.btn}
      >
        <IconMessageSquare />
      </TouchableOpacity>
      <SlideModal visible={visible} onDismiss={dismiss}>
        <GHChatSheet onClose={dismiss} />
      </SlideModal>
    </>
  );
};

// queue

const QueueSheet: FC<{
  nextItems: PlaybackState["nextItems"];
  currentTrack: Track | null;
  onClose(): void;
}> = ({ onClose, nextItems, currentTrack }) => {
  const { t } = useTranslation();

  useBackHandlerDismiss(true, onClose);

  return (
    <SafeAreaView style={sheetStyles.root}>
      <SheetTitle onClose={onClose} title={t("queue.title")} />
      <View style={sheetStyles.content}>
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
      <TouchableOpacity
        accessibilityLabel={t("queue.up_next")}
        onPress={present}
        style={sheetStyles.btn}
      >
        <IconList />
      </TouchableOpacity>
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

// container

const styles = StyleSheet.create({
  bottomBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    paddingTop: 0,
  },
  music: {
    flex: 1,
    padding: Size[6],
    paddingTop: Size[2],
  },
});

const PlayerViewContent: FC = () => {
  return (
    <View style={styles.content}>
      <View style={styles.music}>
        <MusicView />
        <View style={styles.bottomBtns}>
          <QueueButtonAndSheet />
          <ChatButtonAndSheet />
        </View>
      </View>
    </View>
  );
};

export default PlayerViewContent;
