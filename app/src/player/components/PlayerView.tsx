import { useRootSheetModalsSetter } from "@/components/RootSheetModals";
import { RouteName } from "@/screens/types";
import { useTrackQuery } from "@auralous/api";
import {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackTrackId,
} from "@auralous/player";
import {
  Colors,
  Header,
  IconChevronDown,
  IconMoreHorizontal,
  IconPlaylistAdd,
  PlayerChatView,
  Size,
  Spacer,
  Text,
  TextButton,
  useBackHandlerDismiss,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import type { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import MusicView from "./MusicView";
import PlayerBar from "./PlayerBar";
import PlayerViewBackground from "./PlayerViewBackground";

const snapPoints = ["100%"];

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 0,
  },
  headerTitle: {
    paddingVertical: Size[1],
  },
  noChat: {
    flex: 1,
    justifyContent: "center",
    padding: Size[4],
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
    padding: Size[2],
  },
  tabSelected: {
    backgroundColor: Colors.control,
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
      style={[styles.tab, selected && styles.tabSelected]}
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
    if (contextMeta.type === "session") {
      navigation.navigate(RouteName.Session, { id: contextMeta.id });
    } else if (contextMeta.type === "playlist") {
      navigation.navigate(RouteName.Playlist, { id: contextMeta.id });
    }
  }, [contextMeta, navigation]);

  const trackId = usePlaybackTrackId();
  const [{ data }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });
  const track = trackId ? data?.track : null;

  const rootSheetModalsSetter = useRootSheetModalsSetter();

  const presentMenu = useCallback(() => {
    if (!track) return;
    rootSheetModalsSetter.actionSheet({
      visible: true,
      title: track.title,
      subtitle: track.artists.map((artist) => artist.name).join(", "),
      image: track.image || undefined,
      items: [
        {
          icon: <IconPlaylistAdd color={Colors.textSecondary} />,
          text: t("playlist.add_to_playlist.title"),
          onPress: () => rootSheetModalsSetter.addToPlaylist(track),
        },
      ],
    });
  }, [t, track, rootSheetModalsSetter]);

  return (
    <>
      <Header
        title={
          contextMeta ? (
            <TouchableOpacity
              style={styles.headerTitle}
              onPress={onHeaderTitlePress}
            >
              <Text size="xs" style={styles.playingFromText} align="center">
                {t("player.playing_from", { entity: contextMeta.type })}
              </Text>
              <Spacer y={2} />
              <Text size="sm" bold align="center">
                {contextMeta.contextDescription}
              </Text>
            </TouchableOpacity>
          ) : (
            ""
          )
        }
        left={
          <TextButton
            onPress={onDismiss}
            icon={<IconChevronDown />}
            accessibilityLabel={t("common.navigation.go_back")}
          />
        }
        right={
          <TextButton
            icon={<IconMoreHorizontal />}
            onPress={presentMenu}
            accessibilityLabel={t("common.navigation.open_menu")}
          />
        }
      />
    </>
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

  const navigation = useNavigation();
  const onUnauthenticated = useCallback(
    () => navigation.navigate(RouteName.SignIn),
    [navigation]
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
        <View key={1}>
          {contextMeta?.isLive ? (
            <PlayerChatView
              contextMeta={contextMeta}
              onUnauthenticated={onUnauthenticated}
            />
          ) : (
            <View style={styles.noChat}>
              <Text align="center" bold color="textSecondary">
                {t("chat.not_live")}
              </Text>
            </View>
          )}
        </View>
      </PagerView>
    </View>
  );
};

const PlayerView: FC = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

  const present = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", dismiss);
    return unsubscribe;
  }, [navigation, dismiss]);

  const [sheetIndex, setSheetIndex] = useState(-1);

  useBackHandlerDismiss(sheetIndex === 0, dismiss);

  return (
    <>
      <BottomSheetModal
        onChange={setSheetIndex}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        enablePanDownToClose={false}
      >
        <SafeAreaView style={styles.root}>
          <PlayerViewBackground />
          <PlayerViewHeader onDismiss={dismiss} />
          <PlayerViewInner />
        </SafeAreaView>
      </BottomSheetModal>
      <PlayerBar onPress={present} />
    </>
  );
};

export default PlayerView;
