import { IconChevronDown, IconMoreHorizontal } from "@/assets/svg";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { usePlaybackState, usePlayer } from "@/player/Context";
import { usePlaybackContextData } from "@/player/usePlaybackContextData";
import { Size, useColors } from "@/styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PagerView from "react-native-pager-view";
import ChatView from "./ChatView";
import MusicView from "./MusicView";

const snapPoints = ["100%"];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Size[2],
  },
  content: {
    padding: Size[6],
    paddingTop: 0,
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  tab: {
    paddingHorizontal: Size[2],
    paddingVertical: Size[1],
    borderRadius: 9999,
  },
  tabs: {
    padding: Size[2],
    flexDirection: "row",
    justifyContent: "center",
  },
});

const TabButton: React.FC<{
  title: string;
  onPress(): void;
  selected: boolean;
}> = ({ title, onPress, selected }) => {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, selected && { backgroundColor: colors.control }]}
    >
      <Text bold size="sm" color="text">
        {title}
      </Text>
    </Pressable>
  );
};

const PlayerView: React.FC = () => {
  const { t } = useTranslation();
  const player = usePlayer();
  const playbackState = usePlaybackState();

  const contextData = usePlaybackContextData(
    playbackState.contextType,
    playbackState.contextId
  );

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

  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const colors = useColors();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleComponent={null}
    >
      <StatusBar translucent hidden />
      <LinearGradient colors={playbackState.colors} style={styles.root}>
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
        <View style={styles.content}>
          <View style={styles.tabs}>
            <TabButton
              onPress={() => pagerRef.current?.setPage(0)}
              selected={currentPage === 0}
              title={t("music.title")}
            />
            <Spacer x={2} />
            <TabButton
              onPress={() => pagerRef.current?.setPage(1)}
              selected={currentPage === 1}
              title={t("chat.title")}
            />
          </View>
          <PagerView
            onPageSelected={({ nativeEvent }) =>
              setCurrentPage(nativeEvent.position)
            }
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
          >
            <View key={0}>
              <MusicView
                key={0}
                player={player}
                playbackState={playbackState}
              />
            </View>
            <View>
              <ChatView playbackState={playbackState} key={1} />
            </View>
          </PagerView>
        </View>
      </LinearGradient>
    </BottomSheetModal>
  );
};

export default PlayerView;
