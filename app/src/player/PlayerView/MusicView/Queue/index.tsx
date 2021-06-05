import { IconX } from "@/assets/svg";
import { Heading } from "@/components/Typography";
import { Queue, Track } from "@/gql/gql.gen";
import { PlaybackState } from "@/player/Context";
import Player from "@/player/Player";
import { Size, useColors } from "@/styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  gestureHandlerRootHOC,
  TouchableOpacity,
} from "react-native-gesture-handler";
import MetaAndButton from "./MetaAndButton";
import QueueContent from "./QueueContent";

const styles = StyleSheet.create({
  root: {
    padding: Size[4],
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Size[4],
  },
});

const snapPoints = ["100%"];

const QueueSheet: React.FC<{
  playbackState: PlaybackState;
  currentTrack: Track | null;
  queue: Queue;
  player: Player;
  onClose(): void;
}> = ({ onClose, playbackState, currentTrack, queue, player }) => {
  const { t } = useTranslation();
  const colors = useColors();
  return (
    <View
      style={[styles.root, { backgroundColor: colors.backgroundSecondary }]}
    >
      <View style={styles.header}>
        <Heading level={3}>{t("queue.title")}</Heading>
        <TouchableOpacity onPress={onClose}>
          <IconX width={Size[8]} height={Size[8]} stroke={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <QueueContent
          currentTrack={currentTrack}
          playbackState={playbackState}
          queue={queue}
          player={player}
        />
      </View>
    </View>
  );
};

const QueueSheetWithHoc = gestureHandlerRootHOC(QueueSheet);

const QueueModal: React.FC<{
  player: Player;
  playbackState: PlaybackState;
  currentTrack: Track | null;
  queue: Queue | null;
}> = ({ playbackState, currentTrack, queue, player }) => {
  const ref = useRef<BottomSheetModal>(null);

  if (!queue) return null;

  return (
    <>
      <MetaAndButton
        playbackState={playbackState}
        onPress={() => ref.current?.present()}
      />
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        handleComponent={null}
        stackBehavior="push"
      >
        <QueueSheetWithHoc
          currentTrack={currentTrack}
          playbackState={playbackState}
          queue={queue}
          player={player}
          onClose={() => ref.current?.dismiss()}
        />
      </BottomSheetModal>
    </>
  );
};

export default QueueModal;
