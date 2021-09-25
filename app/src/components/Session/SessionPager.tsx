import type { Session } from "@auralous/api";
import { useNowPlayingQuery, useTrackQuery } from "@auralous/api";
import {
  Avatar,
  Button,
  Colors,
  ImageSources,
  Size,
  SkeletonBlock,
  SlideModal,
  Spacer,
  Text,
  TextMarquee,
} from "@auralous/ui";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import type { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import PagerView from "react-native-pager-view";

const snapPoints = ["100%"];

const styles = StyleSheet.create({
  page: {
    backgroundColor: Colors.black,
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
  },
  pageBottom: {
    padding: Size[4],
  },
  pageImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  pageMeta: {
    flexDirection: "row",
    paddingHorizontal: Size[4],
    paddingVertical: Size[8],
  },
  pageMetaText: {
    flex: 1,
    marginLeft: Size[3],
    paddingTop: Size[1],
  },
  pageNowPlaying: {
    flex: 1,
    justifyContent: "space-around",
    padding: Size[8],
  },
  pageNowPlayingImage: {
    height: 0,
    marginVertical: Size[2],
    paddingBottom: "100%",
    position: "relative",
    width: "100%",
  },
  pageNowPlayingImageMeta: { padding: Size[2] },
  root: {
    flex: 1,
  },
});

const bottomGradientColors = ["rgba(0,0,0,0.75)", "rgba(0,0,0,0)"];

const SessionPagerNowPlaying: FC<{ trackId?: string; fetching?: boolean }> = ({
  trackId,
  fetching,
}) => {
  const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: trackId || "" },
    pause: !trackId,
  });

  if (!trackId) return null;

  return (
    <View>
      <View style={styles.pageNowPlayingImage}>
        {fetching ? (
          <SkeletonBlock style={StyleSheet.absoluteFill} />
        ) : (
          <Image
            source={
              dataTrack?.track?.image
                ? { uri: dataTrack.track.image }
                : ImageSources.defaultTrack
            }
            defaultSource={ImageSources.defaultTrack}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.pageNowPlayingImageMeta}>
        {fetchingTrack || fetching ? (
          <SkeletonBlock width={27} height={3} />
        ) : (
          <TextMarquee size="xl" bold duration={10000}>
            {dataTrack?.track?.title}
          </TextMarquee>
        )}
        <Spacer y={3} />
        {fetchingTrack || fetching ? (
          <SkeletonBlock width={24} height={3} />
        ) : (
          <TextMarquee size="lg" color="textSecondary" duration={10000}>
            {dataTrack?.track?.artists.map((artist) => artist.name).join(", ")}
          </TextMarquee>
        )}
      </View>
    </View>
  );
};

const SessionPagerItem: FC<{
  session: Session;
  onNavigate(session: Session): void;
}> = ({ session, onNavigate }) => {
  const { t } = useTranslation();
  const [{ data, fetching }] = useNowPlayingQuery({
    variables: {
      id: session.id,
    },
  });

  const gotoSession = useCallback(
    () => onNavigate(session),
    [session, onNavigate]
  );

  return (
    <View collapsable={false} style={styles.page}>
      {session.image && (
        <Image
          blurRadius={1}
          source={{ uri: session.image }}
          style={styles.pageImage}
        />
      )}
      <View style={styles.pageMeta}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={bottomGradientColors}
        />
        <Avatar
          username={session.creator.username}
          href={session.creator.profilePicture}
          size={12}
        />
        <View style={styles.pageMetaText}>
          <Text bold size="2xl">
            {session.creator.username}
          </Text>
          <Spacer y={2} />
          <Text bold="medium">{session.text}</Text>
        </View>
      </View>
      <View style={styles.pageNowPlaying}>
        <SessionPagerNowPlaying
          fetching={fetching}
          trackId={data?.nowPlaying?.current.trackId}
        />
      </View>
      <View style={styles.pageBottom}>
        <Button onPress={gotoSession}>{t("session.go_to_session")}</Button>
      </View>
    </View>
  );
};

export const SessionPager: FC<{
  sessions: Session[];
  visible: boolean;
  onClose(): void;
  onSessionPaged(session: Session): void;
  onSessionNavigated(session: Session): void;
}> = ({ sessions, visible, onClose, onSessionPaged, onSessionNavigated }) => {
  const onPageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const session = sessions[event.nativeEvent.position];
      if (session) onSessionPaged(session);
    },
    [sessions, onSessionPaged]
  );

  return (
    <SlideModal visible={visible} onDismiss={onClose}>
      <PagerView style={styles.root} onPageSelected={onPageSelected}>
        {sessions.map((session) => (
          <SessionPagerItem
            onNavigate={onSessionNavigated}
            key={session.id}
            session={session}
          />
        ))}
      </PagerView>
    </SlideModal>
  );
};
