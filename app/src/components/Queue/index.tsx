import { usePlaybackContextMeta } from "@/player/PlaybackContextProvider";
import { RouteName } from "@/screens/types";
import { Track } from "@auralous/api";
import {
  PlaybackContextType,
  PlaybackState,
  usePlaybackCurrentContext,
} from "@auralous/player";
import {
  Button,
  Heading,
  IconChevronLeft,
  IconUserPlus,
  makeStyles,
  Size,
  Spacer,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, View } from "react-native";
import {
  gestureHandlerRootHOC,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MetaAndButton from "./MetaAndButton";
import QueueContent from "./QueueContent";

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: Size[4],
  },
  headerSide: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: Size[4],
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
}));

const snapPoints = ["100%"];

const QueueSheet: FC<{
  nextItems: PlaybackState["nextItems"];
  currentTrack: Track | null;
  onClose(): void;
}> = ({ onClose, nextItems, currentTrack }) => {
  const { t } = useTranslation();

  const dstyles = useStyles();

  useEffect(() => {
    const onBackPress = () => {
      onClose();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [onClose]);

  const contextMeta = usePlaybackContextMeta(usePlaybackCurrentContext());
  const navigation = useNavigation();

  const openCollab = useCallback(() => {
    if (contextMeta?.isLive) {
      if (contextMeta.type === PlaybackContextType.Story) {
        navigation.navigate(RouteName.StoryCollaborators, {
          id: contextMeta.id,
        });
      }
    } else {
      // show banner suggesting starting a story
    }
  }, [navigation, contextMeta]);

  return (
    <SafeAreaView style={dstyles.root}>
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

const QueueSheetWithHoc = gestureHandlerRootHOC(QueueSheet);

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
      >
        <QueueSheetWithHoc
          currentTrack={currentTrack}
          nextItems={nextItems}
          onClose={onClose}
        />
      </BottomSheetModal>
    </>
  );
};
