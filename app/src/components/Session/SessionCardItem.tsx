import { IconPause, IconPlay } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { RNLink, Text } from "@/components/Typography";
import player, {
  useIsCurrentPlaybackSelection,
  usePlaybackStateControlContext,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { isTruthy } from "@/utils/utils";
import type { Session } from "@auralous/api";
import { useSessionTracksQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({
  bg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  head: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: Size[3],
  },
  headMeta: {
    paddingLeft: Size[2],
  },
  main: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Size[1],
    flexDirection: "row",
    height: Size[27],
    overflow: "hidden",
    padding: Size[2],
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Size[4],
    paddingVertical: Size[2],
  },
  mainPlay: {
    alignItems: "center",
    justifyContent: "center",
    width: Size[24],
  },
  mainPlayButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .5)",
    borderRadius: 9999,
    height: Size[14],
    justifyContent: "center",
    width: Size[14],
  },
  root: {
    width: "100%",
  },
});

interface SessionCardItemProps {
  session: Session;
  onNavigate(sessionId: string): void;
  onPlay(sessionId: string, index: number): void;
}

const SessionCardItem: FC<SessionCardItemProps> = ({
  session,
  onNavigate,
  onPlay,
}) => {
  const { t } = useTranslation();

  const gotoSession = useCallback(
    () => onNavigate(session.id),
    [onNavigate, session.id]
  );

  const [{ data: dataSessionTracks }] = useSessionTracksQuery({
    variables: {
      id: session.id,
      from: 0,
      to: 2,
    },
  });

  const previewThreeArtists = useMemo(() => {
    if (!dataSessionTracks?.sessionTracks) return;
    return [
      dataSessionTracks.sessionTracks[0]?.artists[0],
      dataSessionTracks.sessionTracks[1]?.artists[0],
      dataSessionTracks.sessionTracks[2]?.artists[0],
    ].filter(isTruthy);
  }, [dataSessionTracks]);

  const isCurrentSelection = useIsCurrentPlaybackSelection(
    "session",
    session.id
  );
  const { isPlaying: playerIsPlaying } = usePlaybackStateControlContext();
  const onPlayPress = () => {
    if (isCurrentSelection) {
      if (playerIsPlaying) player.pause();
      else player.play();
    }
    onPlay(session.id, 0);
  };

  return (
    <View style={styles.root}>
      <Pressable onPress={gotoSession} style={styles.head}>
        <Avatar username={session.creator.username} size={12} />
        <View style={styles.headMeta}>
          <Text color="textSecondary">
            <Trans
              t={t}
              i18nKey="user.share_a_session"
              components={[<Text key="name" bold />]}
              values={{
                username: session.creator.username,
              }}
            />
          </Text>
          <Spacer y={3} />
          <Text size="sm" color="textSecondary">
            {session.createdAt.toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
      <View style={styles.main}>
        <View style={styles.mainPlay}>
          {session.image && (
            <Image source={{ uri: session.image }} style={styles.bg} />
          )}
          <TouchableOpacity style={styles.mainPlayButton} onPress={onPlayPress}>
            {isCurrentSelection && playerIsPlaying ? (
              <IconPause stroke="#ffffff" fill="#ffffff" />
            ) : (
              <IconPlay stroke="#ffffff" fill="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          <RNLink
            to={{ screen: RouteName.Session, params: { id: session.id } }}
          >
            <Text bold size="lg">
              {session.text}
            </Text>
          </RNLink>
          <Spacer y={3} />
          <Text color="textTertiary" size="sm" numberOfLines={2}>
            {previewThreeArtists &&
              t("session.artists_preview", {
                artistNames: previewThreeArtists
                  ?.map((artist) => artist.name)
                  .join(", "),
              })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SessionCardItem;
