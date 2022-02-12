import { IconUser } from "@/assets";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import player, { useIsCurrentPlaybackContext } from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import {
  useMeQuery,
  useNowPlayingQuery,
  useSessionListenersQuery,
  useSessionListenersUpdatedSubscription,
  useTrackQuery,
} from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import SessionMeta from "./SessionMeta";

const styles = StyleSheet.create({
  content: {
    padding: Size[3],
  },
  tag: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: 8,
  },
  textLive: {
    textTransform: "uppercase",
  },
  track: {
    marginTop: Size[1],
    padding: Size[1],
  },
});

const SessionLiveListenersTag: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  // FIXME: create more lightweight queries like useSessionListenersCount()
  const [{ data: dataSessionListeners }] = useSessionListenersQuery({
    variables: {
      id: session.id,
    },
    requestPolicy: "cache-and-network",
  });
  useSessionListenersUpdatedSubscription({
    variables: {
      id: session.id,
    },
  });

  const navigation = useNavigation();
  const viewListeners = useCallback(() => {
    navigation.navigate(RouteName.SessionListeners, { id: session.id });
  }, [navigation, session.id]);

  return (
    <Pressable style={styles.tag} onPress={viewListeners}>
      <Text bold size="sm" style={styles.textLive}>
        {t("common.status.live")}{" "}
      </Text>
      <Text size="sm">
        {t("session.title")} •{" "}
        {dataSessionListeners?.sessionListeners?.length || 0}
      </Text>
      <IconUser color={Colors.primaryText} width={12} height={12} />
    </Pressable>
  );
};

const SessionLiveTrack: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  const [{ data: dataNowPlaying, fetching: fetchingNowPlaying }] =
    useNowPlayingQuery({
      variables: { id: session.id },
    });
  const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: dataNowPlaying?.nowPlaying?.current.trackId || "" },
    pause: !dataNowPlaying?.nowPlaying,
  });

  const track = dataNowPlaying?.nowPlaying ? dataTrack?.track : null;

  return (
    <View style={styles.content}>
      <Text bold>{t("now_playing.title")}</Text>
      <Spacer y={2} />
      <View style={styles.track}>
        {track && (
          <TrackItem
            isPlaying
            track={track || null}
            fetching={fetchingTrack || fetchingNowPlaying}
          />
        )}
      </View>
    </View>
  );
};

const SessionLiveButton: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const joinLive = useCallback(() => {
    player.playContext({
      id: ["session", session.id],
      isLive: true,
      shuffle: false,
    });
  }, [session]);
  const viewCollabs = useCallback(() => {
    navigation.navigate(RouteName.SessionCollaborators, { id: session.id });
  }, [navigation, session.id]);

  const endSession = useCallback(() => {
    navigation.navigate(RouteName.SessionEdit, {
      id: session.id,
      showEndModal: true,
    });
  }, [navigation, session]);

  const isCurrentPlaybackContext = useIsCurrentPlaybackContext(
    "session",
    session.id
  );

  const [{ data: dataMe }] = useMeQuery();
  const isCreator = dataMe?.me?.user.id === session.creatorId;

  return (
    <>
      {isCurrentPlaybackContext && isCreator ? (
        <Button
          onPress={endSession}
          variant="text"
          textProps={{ style: { color: Colors.primary } }}
        >
          {t("session_edit.live.end")}
        </Button>
      ) : (
        <Button
          variant="primary"
          disabled={isCurrentPlaybackContext}
          onPress={joinLive}
        >
          {t("session.join_live")}
        </Button>
      )}
      <Spacer x={2} />
      <View>
        <Button onPress={viewCollabs}>{t("collab.title")}</Button>
      </View>
    </>
  );
};

const SessionLiveContent: FC<{ session: Session }> = ({ session }) => {
  return (
    <Container>
      <SessionMeta
        session={session}
        tag={<SessionLiveListenersTag session={session} />}
        buttons={<SessionLiveButton session={session} />}
      />
      <SessionLiveTrack session={session} />
    </Container>
  );
};

export default SessionLiveContent;
