import { IconChevronDown, IconMoreHorizontal, IconPlayListAdd } from "@/assets";
import { TextButton } from "@/components/Button";
import { useBackHandlerDismiss } from "@/components/Dialog";
import { Header } from "@/components/Header";
import type { PagerViewMethods } from "@/components/PagerView";
import { PagerView } from "@/components/PagerView";
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
import { useTrackQuery } from "@auralous/api";
import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatView from "./ChatView";
import MusicView from "./MusicView";
import PlayerBar from "./PlayerBar";
import PlayerViewBackground from "./PlayerViewBackground";

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
  page: {
    height: "100%",
    width: "100%",
  },
  pagerView: {
    flex: 1,
  },
  playingFromText: {
    textTransform: "uppercase",
  },
  root: {
    height: "100%",
    paddingTop: Size[2],
    width: "100%",
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

  const pagerRef = useRef<PagerViewMethods>(null);
  const [currentPage, setCurrentPage] = useState(0);

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
        onSelected={setCurrentPage}
        ref={pagerRef}
        style={styles.pagerView}
        orientation="horizontal"
      >
        <View style={styles.page} key={0}>
          <MusicView key={0} />
        </View>
        <View style={styles.page} key={1}>
          {contextMeta?.isLive ? (
            <ChatView contextMeta={contextMeta} />
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

const snapPoints = ["100%"];
const BackgroundComponent: FC<BottomSheetBackgroundProps> = ({
  style,
  pointerEvents,
}) => <PlayerViewBackground style={style} pointerEvents={pointerEvents} />;
const handleComponent = () => null;

const PlayerView: FC = () => {
  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [index, setIndex] = useState(-1);

  const dismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const present = useCallback(() => {
    bottomSheetRef.current?.present();
    setIndex(0);
  }, []);

  const onDismiss = useCallback(() => setIndex(-1), []);

  useEffect(() => {
    if (index === -1) return;
    const unsubscribe = navigation.addListener("state", dismiss);
    return unsubscribe;
  }, [navigation, dismiss, index]);

  useBackHandlerDismiss(index === 0, dismiss);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        handleComponent={handleComponent}
        backgroundComponent={BackgroundComponent}
        snapPoints={snapPoints}
        stackBehavior="push"
        enableContentPanningGesture={false}
        onDismiss={onDismiss}
      >
        <SafeAreaView style={styles.root}>
          <PlayerViewHeader onDismiss={dismiss} />
          <PlayerViewInner />
        </SafeAreaView>
      </BottomSheetModal>
      <PlayerBar onPress={present} />
    </>
  );
};

export default PlayerView;
