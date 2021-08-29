import { RouteName } from "@/screens/types";
import type { Session, Track } from "@auralous/api";
import { useSessionTracksQuery } from "@auralous/api";
import player, {
  uidForIndexedTrack,
  usePlaybackCurrentContext,
  usePlaybackQueuePlayingId,
} from "@auralous/player";
import type { RecyclerRenderItem } from "@auralous/ui";
import {
  Button,
  LoadingScreen,
  RecyclerList,
  Size,
  Spacer,
  Text,
  TrackItem,
} from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { createContext, memo, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SessionMeta from "./SessionMeta";

const listPadding = Size[3];
const itemPadding = Size[1];

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[1],
  },
  item: {
    alignItems: "center",
    flexDirection: "row",
    padding: itemPadding,
  },
  listContent: {
    padding: listPadding,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: "#333333",
  },
});

const SessionIdContext = createContext("");

const SessionTrackItem = memo<{
  track: Track;
  index: number;
}>(function SessionTrackItem({ track, index }) {
  const sessionId = useContext(SessionIdContext);
  const onPress = useCallback(
    () =>
      player.playContext({
        id: sessionId,
        initialIndex: index,
        type: "session",
        shuffle: false,
      }),
    [sessionId, index]
  );

  const playbackCurrentContext = usePlaybackCurrentContext();
  const queuePlayingUid = usePlaybackQueuePlayingId();

  const isCurrentTrack = useMemo(
    () =>
      playbackCurrentContext?.type === "session" &&
      playbackCurrentContext.id === sessionId &&
      queuePlayingUid === uidForIndexedTrack(index, track.id),
    [queuePlayingUid, playbackCurrentContext, track.id, index, sessionId]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem isPlaying={isCurrentTrack} track={track} key={index} />
    </TouchableOpacity>
  );
});

const renderItem: RecyclerRenderItem<Track> = ({ item, index }) => (
  <SessionTrackItem key={index} track={item} index={index} />
);

const SessionNonLiveContent: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useSessionTracksQuery({
    variables: { id: session.id },
  });

  const shufflePlay = useCallback(
    () =>
      player.playContext({
        id: session.id,
        type: "session",
        shuffle: true,
      }),
    [session]
  );

  const navigation = useNavigation();

  const quickPlay = useCallback(() => {
    navigation.navigate(RouteName.NewQuickShare, {
      session: {
        ...session,
        // erase createdAt since Date object breaks navigation
        createdAt: null,
      },
    });
  }, [session, navigation]);

  return (
    <>
      <SessionMeta
        session={session}
        tagElement={
          <View style={styles.tag}>
            <Text size="sm" style={styles.tagText}>
              {t("session.title")} •{" "}
              {t("playlist.x_song", { count: session.trackTotal })}
            </Text>
          </View>
        }
      />
      <View style={styles.buttons}>
        <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
        <Spacer x={2} />
        <Button onPress={quickPlay} variant="primary">
          {t("new.quick_share.title")}
        </Button>
      </View>
      <SessionIdContext.Provider value={session.id}>
        <RecyclerList
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={fetching ? <LoadingScreen /> : null}
          data={data?.sessionTracks || []}
          height={Size[12] + 2 * itemPadding + Size[3]} // height + 2 * padding + seperator
          renderItem={renderItem}
          contentHorizontalPadding={listPadding}
        />
      </SessionIdContext.Provider>
    </>
  );
};

export default SessionNonLiveContent;
