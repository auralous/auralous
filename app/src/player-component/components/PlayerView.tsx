import { IconChevronDown, IconMoreHorizontal, IconPlayListAdd } from "@/assets";
import { TextButton } from "@/components/Button";
import { useBackHandlerDismiss } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { useUiDispatch } from "@/context";
import {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackTrackId,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import {
  PlayerBar,
  PlayerChatView,
  PlayerViewBackground,
} from "@/views/Player";
import { useTrackQuery } from "@auralous/api";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import type { FC } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import type { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import MusicView from "./MusicView";

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

  const uiDispatch = useUiDispatch();

  const presentMenu = useCallback(() => {
    if (!track) return;
    uiDispatch({
      type: "contextMenu",
      value: {
        visible: true,
        meta: {
          title: track.title,
          subtitle: track.artists.map((artist) => artist.name).join(", "),
          image: track.image || undefined,
          items: [
            {
              icon: <IconPlayListAdd color={Colors.textSecondary} />,
              text: t("playlist.add_to_playlist.title"),
              onPress: () =>
                uiDispatch({
                  type: "addToPlaylist",
                  value: {
                    visible: true,
                    trackId: track.id,
                  },
                }),
            },
          ],
        },
      },
    });
  }, [t, track, uiDispatch]);

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
            <PlayerChatView contextMeta={contextMeta} />
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

const hiddenRoutes = [
  RouteName.NewFinal,
  RouteName.NewQuickShare,
  RouteName.NewSelectSongs,
  RouteName.SignIn,
  RouteName.Map,
] as string[];

const snapPoints = ["100%"];

const PlayerBarWrapper: FC<{ onPress(): void }> = ({ onPress }) => {
  // PlayerBar but on certain routes, we want to hide it
  const navigationRouteName = useNavigationState((state) =>
    state?.routes ? state.routes[state.routes.length - 1].name : ""
  );

  if (hiddenRoutes.includes(navigationRouteName)) return null;

  return <PlayerBar onPress={onPress} />;
};

const PlayerView: FC = () => {
  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const dismiss = useCallback(() => bottomSheetRef.current?.dismiss(), []);
  const present = useCallback(() => bottomSheetRef.current?.present(), []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", dismiss);
    return unsubscribe;
  }, [navigation, dismiss]);

  const [sheetIndex, setSheetIndex] = useState(-1);

  useBackHandlerDismiss(sheetIndex === 0, dismiss);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        onChange={setSheetIndex}
        snapPoints={snapPoints}
        onDismiss={dismiss}
        handleComponent={null}
        enablePanDownToClose={false}
        enableDismissOnClose={false}
        enableContentPanningGesture={false}
      >
        <SafeAreaView style={styles.root}>
          <PlayerViewBackground />
          <PlayerViewHeader onDismiss={dismiss} />
          <PlayerViewInner />
        </SafeAreaView>
      </BottomSheetModal>
      <PlayerBarWrapper onPress={present} />
    </>
  );
};

export default PlayerView;
