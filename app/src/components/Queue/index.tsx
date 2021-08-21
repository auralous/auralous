import { useBackHandlerDismiss } from "@/components/BottomSheet";
import { RouteName } from "@/screens/types";
import { Track } from "@auralous/api";
import {
  PlaybackState,
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
} from "@auralous/player";
import {
  Button,
  Colors,
  Heading,
  IconChevronLeft,
  IconUserPlus,
  Size,
  Spacer,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useRef } from "react";
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

const snapPoints = ["100%"];

const QueueSheet: FC<{
  nextItems: PlaybackState["nextItems"];
  currentTrack: Track | null;
  onClose(): void;
}> = ({ onClose, nextItems, currentTrack }) => {
  const { t } = useTranslation();

  useBackHandlerDismiss(true, onClose);

  const contextMeta = usePlaybackContextMeta(usePlaybackCurrentContext());
  const navigation = useNavigation();

  const openCollab = useCallback(() => {
    if (contextMeta?.isLive) {
      if (contextMeta.type === "story") {
        navigation.navigate(RouteName.StoryCollaborators, {
          id: contextMeta.id,
        });
      }
    } else {
      // show banner suggesting starting a story
    }
  }, [navigation, contextMeta]);

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
        <View style={styles.headerSide}>
          <Button
            accessibilityLabel={t("collab.add_users")}
            icon={<IconUserPlus width={16} height={16} />}
            onPress={openCollab}
          />
        </View>
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
  const ref = useRef<BottomSheetModal>(null);
  const onOpen = useCallback(() => ref.current?.present(), []);
  const onClose = useCallback(() => ref.current?.dismiss(), []);

  return (
    <>
      <MetaAndButton nextItems={nextItems} onPress={onOpen} />
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        handleComponent={null}
        stackBehavior="push"
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        dismissOnPanDown={false}
      >
        <QueueSheet
          currentTrack={currentTrack}
          nextItems={nextItems}
          onClose={onClose}
        />
      </BottomSheetModal>
    </>
  );
};
