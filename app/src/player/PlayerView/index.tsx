import {
  IconChevronDown,
  IconMessageSquare,
  IconMoreHorizontal,
} from "@/assets/svg";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { useTrackQuery } from "@/gql/gql.gen";
import { Size, useColors } from "@/styles";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { usePlaybackState, usePlayer } from "../Context";
import PlayerQueue from "../PlayerQueue";
import { usePlaybackContextData } from "../usePlaybackContextData";
import PlayerViewChat from "./PlayerViewChat";
import PlayerViewControl from "./PlayerViewControl";
import PlayerViewFooter from "./PlayerViewFooter";
import PlayerViewMeta from "./PlayerViewMeta";
import PlayerViewProgress from "./PlayerViewProgress";
import PlayerViewSheet from "./PlayerViewSheet";

const snapPoints = ["100%"];

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {
    flex: 1,
    padding: Size[6],
  },
});

const PlayerView: React.FC = () => {
  const { t } = useTranslation();
  const player = usePlayer();
  const playbackState = usePlaybackState();

  const contextData = usePlaybackContextData(
    playbackState.contextType,
    playbackState.contextId
  );

  const [{ data: { track } = { track: undefined } }] = useTrackQuery({
    variables: { id: playbackState.trackId || "" },
    pause: !playbackState.trackId,
  });

  const title = useMemo(() => {
    if (contextData.story)
      return t("story.story_of_x", { username: contextData.creator?.username });
    return "";
  }, [contextData, t]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const playerBarPressed = () => bottomSheetRef.current?.present();
    player.on("__player_bar_pressed", playerBarPressed);
    return () => player.off("__player_bar_pressed", playerBarPressed);
  }, [player]);

  const colors = useColors();

  // React ref for bottom sheet screens
  const refChat = useRef<BottomSheet>(null);
  const refQueue = useRef<BottomSheet>(null);

  // footer items
  const footerItems = useMemo(
    () => [
      {
        icon: <IconMessageSquare color={colors.text} width={24} height={24} />,
        title: t("chat.title"),
        onPress: () => refChat.current?.snapTo(1),
      },
      {
        icon: <IconMessageSquare color={colors.text} width={24} height={24} />,
        title: t("queue.title"),
        onPress: () => refQueue.current?.snapTo(1),
      },
    ],
    [refChat, t, colors]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleComponent={null}
    >
      <StatusBar translucent hidden />
      <LinearGradient colors={playbackState.colors} style={styles.fill}>
        <Header
          title={title}
          left={
            <Button
              onPress={() => bottomSheetRef.current?.dismiss()}
              icon={<IconChevronDown color={colors.text} />}
              accessibilityLabel={t("common.navigation.go_back")}
            />
          }
          right={<Button icon={<IconMoreHorizontal color={colors.text} />} />}
        />
        <View style={styles.root}>
          <View style={styles.fill}>
            <PlayerViewMeta track={track || null} />
            <PlayerViewProgress track={track} player={player} />
            <PlayerViewControl playbackState={playbackState} player={player} />
            <PlayerViewFooter items={footerItems} />
          </View>
        </View>
        <PlayerViewSheet
          ref={refChat}
          title={t("chat.title")}
          onClose={() => refChat.current?.snapTo(0)}
        >
          <PlayerViewChat playbackState={playbackState} />
        </PlayerViewSheet>
        <PlayerViewSheet
          ref={refQueue}
          title={t("queue.title")}
          onClose={() => refQueue.current?.snapTo(0)}
        >
          <PlayerQueue />
        </PlayerViewSheet>
      </LinearGradient>
    </BottomSheetModal>
  );
};

export default PlayerView;
