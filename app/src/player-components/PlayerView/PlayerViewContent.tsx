import type { PagerViewMethods } from "@/components/PagerView";
import { PagerView } from "@/components/PagerView";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { usePlaybackContextMeta, usePlaybackCurrentContext } from "@/player";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import ChatView from "./ChatView";
import MusicView from "./MusicView";
import QueueButtonAndSheet from "./QueueButtonAndSheet";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 0,
  },
  music: { flex: 1, padding: Size[6], paddingTop: Size[2] },
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

const PlayerViewContent: FC = () => {
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
          <View style={styles.music}>
            <MusicView />
            <QueueButtonAndSheet />
          </View>
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

export default PlayerViewContent;
