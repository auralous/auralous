import { IconChevronLeft, IconChevronUp } from "@/assets";
import {
  SlideModal,
  useBackHandlerDismiss,
  useDialog,
} from "@/components/Dialog";
import QueueContent from "@/components/Queue/QueueContent";
import { Spacer } from "@/components/Spacer";
import { Heading, Text } from "@/components/Typography";
import type { PlaybackState } from "@/player";
import { usePlaybackNextItems, usePlaybackTrackId } from "@/player";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Track } from "@auralous/api";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const buttonStyles = StyleSheet.create({
  button: {
    padding: Size[2],
  },
  meta: {
    flex: 1,
    height: Size[10],
  },
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Size[2],
  },
});

const MetaAndButton: FC<{
  nextItems: PlaybackState["nextItems"];
  onPress(): void;
}> = ({ nextItems, onPress }) => {
  const { t } = useTranslation();
  const nextTrackId = nextItems[0]?.trackId || undefined;

  const [{ data: dataNextTrack }] = useTrackQuery({
    variables: {
      id: nextTrackId || "",
    },
    pause: !nextTrackId,
  });

  const nextTrack = nextTrackId ? dataNextTrack?.track : null;

  return (
    <TouchableOpacity style={buttonStyles.root} onPress={onPress}>
      <View style={buttonStyles.meta}>
        <Text color="textSecondary" size="sm" bold>
          {t("queue.up_next")}
        </Text>
        <Spacer y={2} />
        <Text color="text" size="sm" bold numberOfLines={1}>
          {nextTrack &&
            `${nextTrack.artists.map((a) => a.name).join(", ")} - ${
              nextTrack.title
            }`}
        </Text>
      </View>
      <View style={buttonStyles.button}>
        <IconChevronUp color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
};

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

const GHQueueSheet = gestureHandlerRootHOC(QueueSheet);

const QueueButtonAndSheet = () => {
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
      <MetaAndButton nextItems={nextItems} onPress={present} />
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
