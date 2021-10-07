import { IconUser } from "@/assets";
import { Button, GradientButton } from "@/components/Button";
import { Container } from "@/components/Layout";
import { Spacer } from "@/components/Spacer";
import { TrackItem } from "@/components/Track";
import { Text } from "@/components/Typography";
import player, { usePlaybackCurrentContext } from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import {
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
    <Container>
      <SessionMeta
        session={session}
        tag={
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
        buttons={
          <>
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
          </>
        }
      />
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
    </Container>
  );
};

export default SessionLiveContent;
