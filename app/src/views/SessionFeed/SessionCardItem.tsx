import {
  IconHeadphones,
  IconMoreVertical,
  IconPause,
  IconPlay,
  IconShare2,
} from "@/assets";
import imageDefaultPlaylist from "@/assets/images/default_playlist.jpg";
import imageDefaultUser from "@/assets/images/default_user.jpg";
import Spacer from "@/components/Spacer/Spacer";
import { Text } from "@/components/Typography";
import { Config } from "@/config";
import player, {
  useIsCurrentPlaybackSelection,
  usePlaybackStateControlContext,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { useTimeDiffFormatter, useUIDispatch } from "@/ui-context";
import { isTruthy } from "@/utils/utils";
import type { Session } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({
  creator: {
    alignItems: "center",
    flexDirection: "row",
  },
  creatorImage: {
    borderRadius: 9999,
    height: Size[4],
    marginRight: Size[1],
    width: Size[4],
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Size[2],
  },
  header: {
    flexDirection: "row",
  },
  image: {
    height: Size[20],
    width: Size[20],
  },
  meta: {
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "center",
    padding: Size[3],
  },
  play: {
    backgroundColor: Colors.white,
    borderRadius: 9999,
    height: Size[8],
    overflow: "hidden",
    padding: Size[2],
    width: Size[8],
  },
  root: {
    height: Size[32],
  },
  time: {
    height: 14,
    justifyContent: "center",
  },
  timeLive: {
    backgroundColor: Colors.primary,
    borderRadius: Size[2],
    paddingHorizontal: Size[1],
  },
});

interface SessionCardItemProps {
  session: Session;
}

const SessionCardItemHeader: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  const tdf = useTimeDiffFormatter();

  const timeDiffText = useMemo(
    () =>
      session.isLive
        ? t("common.status.live").toUpperCase()
        : tdf(session.createdAt),
    [tdf, t, session]
  );

  return (
    <View style={styles.header}>
      <Image
        source={session.image ? { uri: session.image } : imageDefaultPlaylist}
        defaultSource={imageDefaultPlaylist}
        style={styles.image}
      />
      <View style={styles.meta}>
        <View style={[styles.time, session.isLive && styles.timeLive]}>
          <Text size="sm" color={session.isLive ? "text" : "textTertiary"}>
            {timeDiffText}
          </Text>
        </View>
        <Spacer y={2} />
        <Text bold size="lg" numberOfLines={1}>
          {session.text}
        </Text>
        <Spacer y={2} />
        <View style={styles.creator}>
          <Image
            style={styles.creatorImage}
            source={
              session.creator.profilePicture
                ? { uri: session.creator.profilePicture }
                : imageDefaultUser
            }
            defaultSource={imageDefaultUser}
          />
          <Text numberOfLines={1}>{session.creator.username}</Text>
        </View>
      </View>
    </View>
  );
};

const SessionCardItemFooter: FC<{
  session: Session;
}> = ({ session }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

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

  const uiDispatch = useUIDispatch();
  const onMore = () => {
    uiDispatch({
      type: "contextMenu",
      value: {
        visible: true,
        title: session.text,
        subtitle: session.creator.username,
        image: session.image || undefined,
        items: [
          session.isLive && {
            icon: <IconHeadphones stroke={Colors.textSecondary} />,
            text: t("session_listeners.title"),
            onPress() {
              navigation.navigate(RouteName.SessionListeners, {
                id: session.id,
              });
            },
          },
          {
            icon: <IconShare2 stroke={Colors.textSecondary} />,
            text: t("share.share"),
            onPress() {
              uiDispatch({
                type: "share",
                value: {
                  visible: true,
                  title: session.text,
                  url: `${Config.APP_URI}/session/${session.id}`,
                },
              });
            },
          },
        ].filter(isTruthy),
      },
    });
  };

  const onPlay = (sessionId: string, index: number) =>
    player.playContext({
      id: ["session", sessionId],
      initialIndex: index,
      shuffle: false,
      isLive: session.isLive,
    });

  return (
    <View style={styles.footer}>
      <View>
        <TouchableOpacity onPress={onMore}>
          <IconMoreVertical color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.play} onPress={onPlayPress}>
        {isCurrentSelection && playerIsPlaying ? (
          <IconPause
            width={Size[4]}
            height={Size[4]}
            stroke={Colors.background}
            fill={Colors.background}
          />
        ) : (
          <IconPlay
            width={Size[4]}
            height={Size[4]}
            stroke={Colors.background}
            fill={Colors.background}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const SessionCardItem: FC<SessionCardItemProps> = ({ session }) => {
  const navigation = useNavigation();
  const gotoSession = useCallback(
    () => navigation.navigate("session", { id: session.id }),
    [navigation, session.id]
  );

  return (
    <Pressable style={styles.root} onPress={gotoSession}>
      <SessionCardItemHeader session={session} />
      <SessionCardItemFooter session={session} />
    </Pressable>
  );
};

export default SessionCardItem;
