import QueueContent from "@/components/Queue/QueueContent";
import { Text } from "@/components/Typography";
import {
  usePlaybackContextMeta,
  usePlaybackCurrentContext,
  usePlaybackNextItems,
  usePlaybackTrackId,
} from "@/player";
import { Size } from "@/styles/spacing";
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
    paddingBottom: Size[6],
    paddingHorizontal: Size[2],
  },
  noChat: {
    flex: 1,
    justifyContent: "center",
    padding: Size[4],
  },
  sidebar: {
    paddingBottom: Size[2],
    paddingHorizontal: Size[2],
    width: 380,
  },
});

const QueueSidebar: FC = () => {
  const nextItems = usePlaybackNextItems();
  const trackId = usePlaybackTrackId();
  const currentTrack =
    useTrackQuery({
      variables: { id: trackId as string },
      pause: !trackId,
    })[0].data?.track || null;

  return <QueueContent currentTrack={currentTrack} nextItems={nextItems} />;
};

const ChatSidebar: FC = () => {
  const { t } = useTranslation();
  const currentContext = usePlaybackCurrentContext();
  const contextMeta = usePlaybackContextMeta(currentContext);

  return contextMeta?.isLive ? (
    <ChatView contextMeta={contextMeta} />
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
      <View style={styles.sidebar}>
        <QueueSidebar />
      </View>
      <View style={styles.main}>
        <MusicView />
      </View>
      <View style={styles.sidebar}>
        <ChatSidebar />
      </View>
    </View>
  );
};

export default PlayerViewContentLand;
