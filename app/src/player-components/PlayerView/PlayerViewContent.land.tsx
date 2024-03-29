import { Text } from "@/components/Typography";
import { useCurrentPlaybackMeta } from "@/player";
import { usePlaybackStateQueueContext } from "@/player/Context";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import QueueContent from "@/views/Queue/QueueContent";
import { useTrackQuery } from "@auralous/api";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ChatView from "./ChatView";
import MusicView from "./MusicView";

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    flex: 1,
  },
  main: {
    flex: 1,
    marginHorizontal: "auto",
    maxWidth: LayoutSize.sm,
    paddingBottom: Size[6],
    paddingHorizontal: Size[4],
  },
  noChat: {
    flex: 1,
    justifyContent: "center",
    padding: Size[4],
  },
  sidebar: {
    borderColor: Colors.border,
    paddingHorizontal: Size[2],
    paddingVertical: Size[4],
    width: 342,
  },
});

const QueueSidebar: FC = () => {
  const { nextItems, item } = usePlaybackStateQueueContext();
  const currentTrack =
    useTrackQuery({
      variables: { id: item?.trackId as string },
      pause: !item?.trackId,
    })[0].data?.track || null;

  return <QueueContent currentTrack={currentTrack} nextItems={nextItems} />;
};

const ChatSidebar: FC = () => {
  const { t } = useTranslation();
  const currentMeta = useCurrentPlaybackMeta();

  return currentMeta?.isLive ? (
    <ChatView currentMeta={currentMeta} />
  ) : (
    <View style={styles.noChat}>
      <Text align="center" bold color="textSecondary">
        {t("chat.not_live")}
      </Text>
    </View>
  );
};

const PlayerViewContentLand: FC = () => {
  return (
    <View style={styles.content}>
      <View
        style={[styles.sidebar, { borderRightWidth: StyleSheet.hairlineWidth }]}
      >
        <QueueSidebar />
      </View>
      <View style={styles.main}>
        <MusicView />
      </View>
      <View
        style={[styles.sidebar, { borderLeftWidth: StyleSheet.hairlineWidth }]}
      >
        <ChatSidebar />
      </View>
    </View>
  );
};

export default PlayerViewContentLand;
