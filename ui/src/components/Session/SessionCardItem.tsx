import { IconByPlatformName, IconPlay } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import type { Session, Track } from "@auralous/api";
import { useSessionTracksQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
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
    flexDirection: "row",
    paddingHorizontal: Size[4],
    paddingVertical: Size[3],
  },
  headMeta: {
    paddingLeft: Size[2],
    paddingTop: Size[1],
  },
  headMetaTop: {
    alignItems: "center",
    flexDirection: "row",
  },
  main: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Size[2],
    flexDirection: "row",
    height: Size[24],
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Size[2],
    paddingVertical: Size[1],
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
  trackItem: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: Size[1],
  },
  trackItemIndex: {
    borderRadius: 9999,
    height: Size[6],
    marginRight: Size[2],
    textAlign: "center",
    textAlignVertical: "center",
    width: Size[6],
  },
  trackItemTrack: {
    flex: 1,
  },
  trackTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
  trackTitleText: { flex: 1 },
});

interface SessionCardItemProps {
  session: Session;
  onNavigate(sessionId: string): void;
  onPlay(sessionId: string, index: number): void;
}

const SessionCardItemTrack: FC<{
  track: Track;
  index: number;
  onPress(): void;
}> = ({ track, index, onPress }) => {
  return (
    <View style={styles.trackItem}>
      <Text size="sm" color="textSecondary" style={styles.trackItemIndex}>
        {index + 1}
      </Text>
      <View style={styles.trackItemTrack}>
        <TouchableOpacity onPress={onPress} style={styles.trackTitle}>
          <IconByPlatformName
            platformName={track.platform}
            width={Size[4]}
            height={Size[4]}
          />
          <Spacer x={1} />
          <Text
            style={styles.trackTitleText}
            size="sm"
            color="textSecondary"
            numberOfLines={1}
          >
            {track.title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SessionCardItem: FC<SessionCardItemProps> = ({
  session,
  onNavigate,
  onPlay,
}) => {
  const { t } = useTranslation();

  const [{ data: dataSessionTracks }] = useSessionTracksQuery({
    variables: {
      id: session.id,
      from: 0,
      to: 2,
    },
  });

  const gotoSession = useCallback(
    () => onNavigate(session.id),
    [onNavigate, session.id]
  );

  return (
    <View style={styles.root}>
      <Pressable onPress={gotoSession} style={styles.head}>
        <Avatar username={session.creator.username} size={12} />
        <View style={styles.headMeta}>
          <View style={styles.headMetaTop}>
            <Text bold="medium" color="textSecondary">
              {session.creator.username}
            </Text>
            <Spacer x={1} />
            <Text size="sm" color="textTertiary">
              {session.createdAt.toLocaleDateString()}
            </Text>
          </View>
          <Spacer y={2} />
          <Text bold>{session.text}</Text>
        </View>
      </Pressable>
      <View style={styles.main}>
        <View style={styles.mainPlay}>
          {session.image && (
            <Image
              source={{ uri: session.image }}
              style={styles.bg}
              blurRadius={4}
            />
          )}
          <TouchableOpacity
            style={styles.mainPlayButton}
            onPress={() => onPlay(session.id, 0)}
          >
            <IconPlay stroke="#ffffff" fill="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          {dataSessionTracks?.sessionTracks?.map((item, index) => (
            <SessionCardItemTrack
              key={`${index}${item.id}`}
              track={item}
              index={index}
              onPress={() => onPlay(session.id, index)}
            />
          ))}
          <Spacer y={1.5} />
          <TouchableOpacity onPress={gotoSession}>
            <Text size="sm" align="center">
              {t("playlist.view_all_x_songs", { count: session.trackTotal })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SessionCardItem;
