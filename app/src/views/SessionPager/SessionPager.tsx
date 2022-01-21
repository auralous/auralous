import {
  IconChevronLeft,
  IconChevronRight,
  IconPlay,
  IconSkipBack,
  IconSkipForward,
} from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { LoadingScreen } from "@/components/Loading";
import type { PagerViewMethods } from "@/components/PagerView";
import { PagerView } from "@/components/PagerView";
import { Spacer } from "@/components/Spacer";
import { AnimatedAudioBar } from "@/components/Track/AnimatedAudioBar";
import { Text } from "@/components/Typography";
import player, {
  usePlaybackCurrentContext,
  usePlaybackCurrentControl,
  usePlaybackProvidedTrackId,
} from "@/player";
import { RouteName } from "@/screens/types";
import { Colors } from "@/styles/colors";
import { LayoutSize, Size } from "@/styles/spacing";
import type { Session } from "@auralous/api";
import { useNowPlayingQuery, useTrackQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  background: {
    opacity: 0.6,
    zIndex: -1,
    ...StyleSheet.absoluteFillObject,
  },
  buttonPlay: {
    height: Size[16],
    width: Size[16],
  },
  buttonSkip: {
    height: Size[12],
    width: Size[12],
  },
  content: {
    flex: 1,
  },
  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  isPlaying: {
    alignItems: "center",
    justifyContent: "center",
  },
  landscapeBtn: {
    position: "absolute",
    top: "50%",
    transform: [
      {
        translateY: -Size[10] / 2,
      },
    ],
    zIndex: 1,
  },
  landscapeBtnLeft: {
    left: Size[2],
  },
  landscapeBtnRight: {
    right: Size[2],
  },
  meta: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Size[4],
    paddingVertical: Size[1],
  },
  metaText: {
    flex: 1,
    marginLeft: Size[2],
  },
  nowPlaying: {
    backgroundColor: "rgba(0,0,0,.5)",
    borderRadius: 8,
    flexDirection: "row",
    height: Size[12],
    marginHorizontal: Size[4],
    marginVertical: Size[1],
    paddingHorizontal: Size[2],
  },
  nowPlayingText: {
    flex: 1,
    justifyContent: "center",
  },
  page: {
    backgroundColor: Colors.black,
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
  },
  pager: {
    flex: 1,
  },
  pauseScreen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  pauseScreenBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,.8)",
  },
  root: {
    flex: 1,
  },
});

const SessionPagerNowPlaying: FC<{ trackId?: string; fetching?: boolean }> = ({
  trackId,
}) => {
  const [{ data: dataTrack }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  return (
    <View style={styles.nowPlaying}>
      <View style={styles.isPlaying}>
        <AnimatedAudioBar />
      </View>
      <Spacer x={2} />
      <View style={styles.nowPlayingText}>
        <Text bold numberOfLines={1}>
          {dataTrack?.track?.title}
        </Text>
        <Spacer y={2} />
        <Text numberOfLines={1} color="textSecondary">
          {dataTrack?.track?.artists.map((artist) => artist.name).join(", ")}
        </Text>
      </View>
    </View>
  );
};

const SessionPagerMeta: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={styles.meta}>
      <Avatar
        size={12}
        username={session.creator.username}
        href={session.creator.profilePicture}
      />
      <View style={styles.metaText}>
        <Pressable
          onPress={() =>
            navigation.navigate(RouteName.User, {
              username: session.creator.username,
            })
          }
        >
          <Text size="lg" bold>
            {session.creator.username}
          </Text>
        </Pressable>
        <Spacer y={2} />
        <Pressable
          onPress={() =>
            navigation.navigate(RouteName.Session, {
              id: session.id,
            })
          }
        >
          <Text>{session.text}</Text>
        </Pressable>
      </View>
      <Button
        onPress={() =>
          navigation.navigate(RouteName.Session, { id: session.id })
        }
      >
        {t("session.go_to_session")}
      </Button>
    </View>
  );
};

const onPlay = () => player.play();
const onPause = () => player.pause();
const onSkipForward = () => player.skipForward();
const onSkipBackward = () => player.skipBackward();

const SessionPagerBg: FC<{ session: Session }> = ({ session }) => {
  return session.image ? (
    <Image source={{ uri: session.image }} style={styles.background} />
  ) : null;
};

const SessionPagerControl: FC<{ session: Session }> = ({ session }) => {
  const { t } = useTranslation();
  const { isPlaying } = usePlaybackCurrentControl();

  const animValue = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) animValue.value = withTiming(0);
    else animValue.value = withTiming(1);
  }, [isPlaying, animValue]);

  const pauseScreenStyle = useAnimatedStyle(
    () => ({
      opacity: animValue.value,
    }),
    []
  );

  return (
    <>
      <Pressable
        accessibilityLabel={t("player.pause")}
        style={StyleSheet.absoluteFill}
        onPress={onPause}
      />
      <Animated.View
        style={[styles.pauseScreen, pauseScreenStyle]}
        focusable={!isPlaying}
        importantForAccessibility={isPlaying ? "no-hide-descendants" : "auto"}
        accessibilityElementsHidden={isPlaying}
        pointerEvents={isPlaying ? "none" : "auto"}
      >
        {session.image && (
          <Image
            source={{ uri: session.image }}
            style={StyleSheet.absoluteFill}
            blurRadius={8}
          />
        )}
        <Pressable onPress={onPlay} style={styles.pauseScreenBackdrop} />
        <Button
          onPress={onSkipBackward}
          icon={<IconSkipBack />}
          accessibilityLabel={t("player.skip_backward")}
          style={styles.buttonSkip}
        />
        <Spacer x={4} />
        <Button
          variant="filled"
          onPress={onPlay}
          icon={<IconPlay fill={Colors.background} />}
          accessibilityLabel={t("player.play")}
          style={styles.buttonPlay}
        />
        <Spacer x={4} />
        <Button
          onPress={onSkipForward}
          icon={<IconSkipForward />}
          accessibilityLabel={t("player.skip_forward")}
          style={styles.buttonSkip}
        />
      </Animated.View>
    </>
  );
};

const useCurrentTrack = (session: Session) => {
  const [{ data: dataNowPlaying }] = useNowPlayingQuery({
    variables: {
      id: session.id,
    },
    pause: !session.isLive,
  });
  const playbackCurrentContext = usePlaybackCurrentContext();
  const currentTrackId = usePlaybackProvidedTrackId();
  if (session.isLive) {
    return dataNowPlaying?.nowPlaying?.current.trackId;
  }
  if (
    playbackCurrentContext?.type === "session" &&
    playbackCurrentContext.id === session.id
  ) {
    return currentTrackId;
  }
  return undefined;
};

const SessionPagerItem: FC<{
  session: Session;
}> = ({ session }) => {
  const currentTrackId = useCurrentTrack(session);

  return (
    <View collapsable={false} style={styles.page}>
      <SessionPagerBg session={session} />
      <SessionPagerControl session={session} />
      <View style={styles.content} pointerEvents="none" />
      <SessionPagerMeta session={session} />
      <SessionPagerNowPlaying trackId={currentTrackId || undefined} />
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

  const windowWidth = useWindowDimensions().width;
  const isLandscape = windowWidth >= LayoutSize.md;

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
      {isLandscape && (
        <>
          <Button
            accessibilityLabel={t("common.navigation.go_back")}
            style={[styles.landscapeBtn, styles.landscapeBtnLeft]}
            icon={<IconChevronLeft />}
            onPress={() => ref.current?.setPage(currentPage - 1)}
            disabled={currentPage <= 0}
          />
          <Button
            accessibilityLabel={t("common.navigation.go_forward")}
            style={[styles.landscapeBtn, styles.landscapeBtnRight]}
            icon={<IconChevronRight />}
            onPress={() => ref.current?.setPage(currentPage + 1)}
            disabled={currentPage >= sessions.length - 1}
          />
        </>
      )}
      <PagerView
        ref={ref}
        style={styles.pager}
        orientation={isLandscape ? "horizontal" : "vertical"}
        onSelected={onPageSelected}
      >
        {sessions.map((session) => (
          <SessionPagerItem key={session.id} session={session} />
        ))}
      </PagerView>
    </View>
  );
};

export default SessionPager;
