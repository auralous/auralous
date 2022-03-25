import { Button } from "@/components/Button";
import { useContainerStyle } from "@/components/Container";
import { LoadingScreen } from "@/components/Loading";
import { ResultEmptyScreen } from "@/components/Result";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import type { PlaybackStateQueue } from "@/player";
import player, {
  uidForIndexedTrack,
  useIsCurrentPlaybackSelection,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { Session, Track } from "@auralous/api";
import { useSessionTracksQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import SessionMeta from "./SessionMeta";

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Size[3],
    paddingVertical: Size[1],
  },
  root: {
    flex: 1,
  },
  tag: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 9999,
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: 8,
  },
  tagText: {
    color: "#333333",
  },
});

const SessionTrackItem = memo<{
  sessionId: string;
  track: Track;
  index: number;
  isCurrentSelection: boolean;
}>(function SessionTrackItem({ sessionId, track, index, isCurrentSelection }) {
  const onPress = useCallback(
    () =>
      player.playContext({
        id: ["session", sessionId],
        initialIndex: index,
        shuffle: false,
      }),
    [sessionId, index]
  );

  const uid = useMemo(
    () => uidForIndexedTrack(index, track.id),
    [index, track.id]
  );

  const [isCurrentUid, setIsCurrentUid] = useState(false);
  useEffect(() => {
    if (!isCurrentSelection) {
      setIsCurrentUid(false);
      return;
    }

    setIsCurrentUid(player.getState().queue.item?.uid === uid);

    const onStateQueue = (stateQueue: PlaybackStateQueue) => {
      setIsCurrentUid(stateQueue.item?.uid === uid);
    };
    player.on("state-queue", onStateQueue);
    return () => player.off("state-queue", onStateQueue);
  }, [uid, isCurrentSelection]);

  const isCurrentTrack = isCurrentSelection && isCurrentUid;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem isPlaying={isCurrentTrack} track={track} key={index} />
    </TouchableOpacity>
  );
});

const itemHeight = Size[12] + 2 * Size[1] + Size[2];
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});
const ItemSeparatorComponent = () => <Spacer y={2} />;

const SessionNovLiveButtons: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();

  const shufflePlay = useCallback(
    () =>
      player.playContext({
        id: ["session", session.id],
        shuffle: true,
      }),
    [session]
  );

  const navigation = useNavigation();
  const quickShare = useCallback(
    (session: Session) => {
      navigation.navigate(RouteName.NewQuickShare, {
        session: {
          ...session,
          // erase createdAt since Date object breaks navigation
          createdAt: null,
        },
      });
    },
    [navigation]
  );

  return (
    <>
      <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
      <Spacer x={2} />
      <Button onPress={() => quickShare(session)} variant="primary">
        {t("new.quick_share.title")}
      </Button>
    </>
  );
};

const SessionNonLiveContent: FC<{
  session: Session;
}> = ({ session }) => {
  const { t } = useTranslation();

  // FIXME: This causes setState in render
  const [{ data, fetching }] = useSessionTracksQuery({
    variables: { id: session.id },
  });

  const containerStyle = useContainerStyle();

  const isCurrentSelection = useIsCurrentPlaybackSelection(
    "session",
    session.id
  );
  const renderItem = useCallback<ListRenderItem<Track>>(
    ({ item, index }) => (
      <SessionTrackItem
        key={index}
        sessionId={session.id}
        track={item}
        index={index}
        isCurrentSelection={isCurrentSelection}
      />
    ),
    [session.id, isCurrentSelection]
  );

  const ListHeadComponent = useMemo(
    () => (
      <SessionMeta
        session={session}
        tag={
          <View style={styles.tag}>
            <Text size="sm" style={styles.tagText}>
              {t("session.title")} •{" "}
              {t("playlist.x_song", { count: session.trackTotal })}
            </Text>
          </View>
        }
        buttons={<SessionNovLiveButtons session={session} />}
      />
    ),
    [session, t]
  );
  return (
    <FlatList
      ListHeaderComponent={ListHeadComponent}
      ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
      ItemSeparatorComponent={ItemSeparatorComponent}
      style={styles.root}
      contentContainerStyle={containerStyle}
      data={data?.sessionTracks || []}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={0}
      removeClippedSubviews
      windowSize={10}
    />
  );
};

export default SessionNonLiveContent;
