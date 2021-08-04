import { RouteName } from "@/screens/types";
import player, {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
} from "@auralous/player";
import {
  Button,
  Header,
  IconChevronDown,
  IconMoreHorizontal,
  makeStyles,
  Size,
  Spacer,
  Text,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatView from "./ChatView";
import MusicView from "./MusicView";
import PlayerViewBackground from "./PlayerViewBackground";

const snapPoints = ["100%"];

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 0,
  },
  pagerView: {
    flex: 1,
  },
  playingFromText: {
    textTransform: "uppercase",
  },

  root: {
    flex: 1,
    paddingTop: Size[2],
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[2],
    paddingBottom: Size[0],
  },
});

const useStyles = makeStyles((theme, props: { selected: boolean }) => ({
  tab: {
    paddingHorizontal: Size[2],
    paddingVertical: Size[1],
    borderRadius: 9999,
    backgroundColor: props.selected ? theme.colors.control : "transparent",
  },
}));

const TabButton: FC<{
  title: string;
  onPress(): void;
  selected: boolean;
}> = ({ title, onPress, selected }) => {
  const dstyles = useStyles({ selected });

  return (
    <Pressable onPress={onPress} style={dstyles.tab}>
      <Text bold size="sm" color="text">
        {title}
      </Text>
    </Pressable>
  );
};

const PlayerView: FC = () => {
  const { t } = useTranslation();
  const currentContext = usePlaybackCurrentContext();

  const contextMeta = usePlaybackContextMeta(currentContext);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const playerBarPressed = () => bottomSheetRef.current?.present();
    player.on("__player_bar_pressed", playerBarPressed);
    return () => player.off("__player_bar_pressed", playerBarPressed);
  }, []);

  const dismiss = useCallback(() => bottomSheetRef.current?.dismiss(), []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", dismiss);
    return unsubscribe;
  }, [navigation, dismiss]);

  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [sheetIndex, setSheetIndex] = useState(-1);

  useEffect(() => {
    const onBackPress = () => {
      if (sheetIndex !== 0) return false;
      dismiss();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [dismiss, sheetIndex]);

  const onPageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) =>
      setCurrentPage(event.nativeEvent.position),
    []
  );

  const onHeaderTitlePress = useCallback(() => {
    if (!contextMeta) return;
    if (contextMeta.type === "story") {
      navigation.navigate(RouteName.Story, { id: contextMeta.id });
    } else if (contextMeta.type === "playlist") {
      navigation.navigate(RouteName.Playlist, { id: contextMeta.id });
    }
  }, [contextMeta, navigation]);

  return (
    <BottomSheetModal
      onChange={setSheetIndex}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleComponent={null}
    >
      <SafeAreaView style={styles.root}>
        <PlayerViewBackground />
        <Header
          title={
            contextMeta ? (
              <TouchableOpacity onPress={onHeaderTitlePress}>
                <Text size="xs" style={styles.playingFromText} align="center">
                  {t("player.playing_from", { entity: contextMeta.type })}
                </Text>
                <Text size="sm" bold align="center">
                  {contextMeta.contextDescription}
                </Text>
              </TouchableOpacity>
            ) : (
              ""
            )
          }
          left={
            <Button
              onPress={dismiss}
              icon={<IconChevronDown />}
              accessibilityLabel={t("common.navigation.go_back")}
            />
          }
          right={<Button icon={<IconMoreHorizontal />} />}
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
            onPageSelected={onPageSelected}
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
          >
            <View key={0}>
              <MusicView key={0} />
            </View>
            <View>
              <ChatView contextMeta={contextMeta} key={1} />
            </View>
          </PagerView>
        </View>
      </SafeAreaView>
    </BottomSheetModal>
  );
};

export default PlayerView;
