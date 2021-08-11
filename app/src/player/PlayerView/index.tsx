import { RouteName } from "@/screens/types";
import {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
} from "@auralous/player";
import {
  Button,
  Colors,
  Header,
  IconChevronDown,
  IconMoreHorizontal,
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
import PlayerBar from "../PlayerBar";
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
  tab: {
    backgroundColor: Colors.none,
    borderRadius: 9999,
    paddingHorizontal: Size[2],
    paddingVertical: Size[1],
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[2],
    paddingBottom: Size[0],
  },
});

const TabButton: FC<{
  title: string;
  onPress(): void;
  selected: boolean;
}> = ({ title, onPress, selected }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, selected && { backgroundColor: Colors.control }]}
    >
      <Text bold size="sm" color="text">
        {title}
      </Text>
    </Pressable>
  );
};

const PlayerViewHeader: FC<{ onDismiss(): void }> = ({ onDismiss }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const currentContext = usePlaybackCurrentContext();
  const contextMeta = usePlaybackContextMeta(currentContext);

  const onHeaderTitlePress = useCallback(() => {
    if (!contextMeta) return;
    if (contextMeta.type === "story") {
      navigation.navigate(RouteName.Story, { id: contextMeta.id });
    } else if (contextMeta.type === "playlist") {
      navigation.navigate(RouteName.Playlist, { id: contextMeta.id });
    }
  }, [contextMeta, navigation]);

  return (
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
          onPress={onDismiss}
          icon={<IconChevronDown />}
          accessibilityLabel={t("common.navigation.go_back")}
        />
      }
      right={<Button icon={<IconMoreHorizontal />} />}
    />
  );
};

const PlayerViewInner: FC = () => {
  const { t } = useTranslation();

  const currentContext = usePlaybackCurrentContext();
  const contextMeta = usePlaybackContextMeta(currentContext);

  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const onPageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) =>
      setCurrentPage(event.nativeEvent.position),
    []
  );

  return (
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
  );
};

const PlayerView: FC = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

  const present = useCallback(() => bottomSheetRef.current?.present(), []);
  const dismiss = useCallback(() => bottomSheetRef.current?.dismiss(), []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", dismiss);
    return unsubscribe;
  }, [navigation, dismiss]);

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

  return (
    <>
      <BottomSheetModal
        onChange={setSheetIndex}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        enableContentPanningGesture
      >
        <SafeAreaView style={styles.root}>
          <PlayerViewBackground />
          <PlayerViewHeader onDismiss={dismiss} />
          <PlayerViewInner />
        </SafeAreaView>
      </BottomSheetModal>
      <PlayerBar visible={sheetIndex === -1} onPress={present} />
    </>
  );
};

export default PlayerView;
