import { Button } from "@/components/Button";
import { renderLoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import player, {
  uidForIndexedTrack,
  usePlaybackCurrentContext,
  usePlaybackQueuePlayingId,
} from "@/player";
import { Size } from "@/styles/spacing";
import type { Session, Track } from "@auralous/api";
import { useSessionTracksQuery } from "@auralous/api";
import type { FC } from "react";
import { createContext, memo, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { BigListRenderItem } from "react-native-big-list";
import BigList from "react-native-big-list";
import SessionMeta from "./SessionMeta";

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Size[3],
  },
  listContent: {
    paddingVertical: Size[3],
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

const renderItem: BigListRenderItem<Track> = ({ item, index }) => (
  <SessionTrackItem key={index} track={item} index={index} />
);

const SessionNonLiveContent: FC<{
  session: Session;
  onQuickShare(session: Session): void;
}> = ({ session, onQuickShare }) => {
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

  const quickShare = useCallback(
    () => onQuickShare(session),
    [onQuickShare, session]
  );

  const renderHeader = useCallback(
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
        buttons={
          <>
            <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
            <Spacer x={2} />
            <Button onPress={quickShare} variant="primary">
              {t("new.quick_share.title")}
            </Button>
          </>
        }
      />
    ),
    [t, session, quickShare, shufflePlay]
  );

  return (
    <>
      <SessionIdContext.Provider value={session.id}>
        <BigList
          headerHeight={320}
          renderHeader={renderHeader}
          renderEmpty={fetching ? renderLoadingScreen : undefined}
          contentContainerStyle={styles.listContent}
          itemHeight={Size[12] + 2 * Size[1] + Size[2]} // height + 2 * padding + seperator
          data={data?.sessionTracks || []}
          renderItem={renderItem}
        />
      </SessionIdContext.Provider>
    </>
  );
};

export default SessionNonLiveContent;
