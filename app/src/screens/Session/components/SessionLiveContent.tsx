import { GradientButton } from "@/components/Button";
import { RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import {
  useNowPlayingQuery,
  useSessionListenersQuery,
  useSessionListenersUpdatedSubscription,
  useTrackQuery,
} from "@auralous/api";
import player, { usePlaybackCurrentContext } from "@auralous/player";
import {
  Button,
  Colors,
  IconUser,
  Size,
  Spacer,
  Text,
  TrackItem,
} from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import SessionMeta from "./SessionMeta";

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[1],
  },
  content: {
    padding: Size[3],
  },
  tag: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textLive: {
    textTransform: "uppercase",
  },
  track: {
    marginTop: Size[1],
    padding: Size[1],
  },
});

const SessionLiveContent: FC<{ session: Session }> = ({ session }) => {
  const playbackCurrentContext = usePlaybackCurrentContext();

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

  const joinLive = useCallback(() => {
    player.playContext({
      id: session.id,
      type: "session",
      shuffle: false,
    });
  }, [session]);

  const navigation = useNavigation();

  const viewCollabs = useCallback(() => {
    navigation.navigate(RouteName.SessionCollaborators, { id: session.id });
  }, [navigation, session.id]);

  const viewListeners = useCallback(() => {
    navigation.navigate(RouteName.SessionListeners, { id: session.id });
  }, [navigation, session.id]);

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
    <>
      <SessionMeta
        session={session}
        tagElement={
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
        }
      />
      <View style={styles.buttons}>
        <GradientButton
          disabled={
            playbackCurrentContext?.type === "session" &&
            playbackCurrentContext.id === session.id
          }
          onPress={joinLive}
        >
          {t("session.join_live")}
        </GradientButton>
        <Spacer x={2} />
        <View>
          <Button onPress={viewCollabs}>{t("collab.title")}</Button>
        </View>
      </View>
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
    </>
  );
};

export default SessionLiveContent;
