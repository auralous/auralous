import { IconPause, IconPlay, IconSkipBack, IconSkipForward } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import type { PagerViewMethods } from "@/components/PagerView";
import { PagerView } from "@/components/PagerView";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import player, {
  useIsCurrentPlaybackContext,
  usePlaybackCurrentControl,
  usePlaybackTrackId,
} from "@/player";
import PlayerViewMeta from "@/player-components/PlayerView/PlayerViewMeta";
import PlayerViewProgress from "@/player-components/PlayerView/PlayerViewProgress";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import { useNowPlayingQuery, useTrackQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  backPrev: {
    alignItems: "center",
    height: Size[10],
    justifyContent: "center",
    width: Size[10],
  },
  control: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: Size[1],
    paddingVertical: Size[2],
  },
  creator: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[14],
    paddingHorizontal: Size[4],
  },
  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  page: {
    flex: 1,
  },
  pageContainer: {
    height: "100%",
    paddingHorizontal: Size[6],
    paddingVertical: Size[2],
    width: "100%",
  },
  pager: {
    flex: 1,
  },
  playPause: {
    alignItems: "center",
    backgroundColor: Colors.textTertiary,
    borderRadius: 9999,
    height: Size[16],
    justifyContent: "center",
    width: Size[16],
  },
  root: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingTop: Size[2],
  },
  sButton: {
    padding: Size[4],
  },
});

const useCurrentTrack = (session: Session) => {
  const [{ data: dataNowPlaying }] = useNowPlayingQuery({
    variables: {
      id: session.id,
    },
    pause: !session.isLive,
  });
  const currentTrackId = usePlaybackTrackId();

  const isCurrentPlaybackContext = useIsCurrentPlaybackContext(
    "session",
    session.id
  );

  if (session.isLive) {
    return dataNowPlaying?.nowPlaying?.current.trackId;
  }
  if (isCurrentPlaybackContext) {
    return currentTrackId;
  }
  return undefined;
};

const SessionPagerButton: FC<{
  session: Session;
}> = ({ session }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={styles.sButton}>
      <Button
        variant="primary"
        onPress={() =>
          navigation.navigate(RouteName.Session, { id: session.id })
        }
      >
        {t("session.go_to_session")}
      </Button>
    </View>
  );
};

const SessionPagerCreator: FC<{
  session: Session;
}> = ({ session }) => {
  return (
    <View style={styles.creator}>
      <Avatar
        size={10}
        username={session.creator.username}
        href={session.creator.profilePicture}
      />
      <Spacer x={2} />
      <View>
        <Text bold>{session.creator.username}</Text>
        <Spacer y={2} />
        <Text>{session.text}</Text>
      </View>
    </View>
  );
};

const SessionPagerControl: FC<{
  onSkipBackward(): void;
  onSkipForward(): void;
}> = ({ onSkipBackward, onSkipForward }) => {
  const { t } = useTranslation();
  const control = usePlaybackCurrentControl();
  const togglePlay = useCallback(
    () => (control.isPlaying ? player.pause() : player.play()),
    [control.isPlaying]
  );

  return (
    <View style={styles.control}>
      <TouchableOpacity
        style={styles.backPrev}
        accessibilityLabel={t("player.skip_backward")}
        onPress={onSkipBackward}
      >
        <IconSkipBack width={Size[8]} height={Size[8]} fill={Colors.text} />
      </TouchableOpacity>
      <Spacer x={8} />
      <View>
        <TouchableOpacity
          onPress={togglePlay}
          style={styles.playPause}
          accessibilityLabel={
            control.isPlaying ? t("player.pause") : t("player.play")
          }
        >
          {control.isPlaying ? (
            <IconPause width={Size[10]} height={Size[10]} fill={Colors.text} />
          ) : (
            <IconPlay width={Size[10]} height={Size[10]} fill={Colors.text} />
          )}
        </TouchableOpacity>
      </View>
      <Spacer x={8} />
      <TouchableOpacity
        style={styles.backPrev}
        accessibilityLabel={t("player.skip_forward")}
        onPress={onSkipForward}
      >
        <IconSkipForward width={Size[8]} height={Size[8]} fill={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const SessionPagerItem: FC<{
  session: Session;
}> = ({ session }) => {
  const currentTrackId = useCurrentTrack(session);
  const [{ data, fetching }] = useTrackQuery({
    variables: { id: currentTrackId || "" },
    pause: !currentTrackId,
  });
  const track = currentTrackId ? data?.track : null;

  return (
    <View style={styles.pageContainer}>
      <View collapsable={false} style={styles.page}>
        <PlayerViewMeta track={track || null} fetching={fetching} />
        <PlayerViewProgress track={track} player={player} isLive />
      </View>
    </View>
  );
};

const SessionPager: FC<{
  sessions: Session[];
  onSelected(page: number): void;
  fetching?: boolean;
}> = ({ sessions, onSelected, fetching }) => {
  const { t } = useTranslation();
  const ref = useRef<PagerViewMethods>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const onPageSelected = useCallback(
    (page: number) => {
      setCurrentPage(page);
      onSelected(page);
    },
    [onSelected]
  );

  if (sessions.length === 0) {
    if (fetching) return <LoadingScreen />;
    return (
      <View style={styles.empty}>
        <Text color="textSecondary">{t("feed.feed_empty")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SessionPagerCreator session={sessions[currentPage]} />
      <PagerView
        ref={ref}
        style={styles.pager}
        orientation="horizontal"
        onSelected={onPageSelected}
      >
        {sessions.map((session) => (
          <SessionPagerItem key={session.id} session={session} />
        ))}
      </PagerView>
      <SessionPagerControl
        onSkipBackward={() =>
          currentPage > 0 && ref.current?.setPage(currentPage - 1)
        }
        onSkipForward={() =>
          currentPage < sessions.length - 1 &&
          ref.current?.setPage(currentPage + 1)
        }
      />
      <SessionPagerButton session={sessions[currentPage]} />
    </View>
  );
};

export default SessionPager;
