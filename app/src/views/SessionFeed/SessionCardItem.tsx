import { IconMoreVertical, IconPause, IconPlay } from "@/assets";
import imageDefaultPlaylist from "@/assets/images/default_playlist.jpg";
import imageDefaultUser from "@/assets/images/default_user.jpg";
import { ContextMenuValue } from "@/components/BottomSheet";
import { Image } from "@/components/Image";
import { RNLink } from "@/components/Link";
import Spacer from "@/components/Spacer/Spacer";
import { Text } from "@/components/Typography";
import player, {
  useIsCurrentPlaybackSelection,
  usePlaybackStateControlContext,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import { useTimeDiffFormatter, useUIDispatch } from "@/ui-context";
import type { Session } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
    <RNLink
      style={styles.header}
      to={{ screen: RouteName.Session, params: { id: session.id } }}
    >
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
    </RNLink>
  );
};

const SessionCardItemFooter: FC<{
  session: Session;
}> = ({ session }) => {
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
      value: ContextMenuValue.session(uiDispatch, navigation, session, false),
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
  return (
    <View style={styles.root}>
      <SessionCardItemHeader session={session} />
      <SessionCardItemFooter session={session} />
    </View>
  );
};

export default SessionCardItem;
