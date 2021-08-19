import { Story, useNowPlayingQuery, useTrackQuery } from "@auralous/api";
import {
  Avatar,
  Button,
  Colors,
  ImageSources,
  Size,
  SkeletonBlock,
  Spacer,
  Text,
  TextMarquee,
} from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FC, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { useBackHandlerDismiss } from "../BottomSheet/useBackHandlerDismiss";

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

const StoryPagerNowPlaying: FC<{ trackId?: string; fetching?: boolean }> = ({
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

const StoryPagerItem: FC<{ story: Story; onNavigate(story: Story): void }> = ({
  story,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const [{ data, fetching }] = useNowPlayingQuery({
    variables: {
      id: story.id,
    },
  });

  const gotoStory = useCallback(() => onNavigate(story), [story, onNavigate]);

  return (
    <View collapsable={false} style={styles.page}>
      {story.image && (
        <Image
          blurRadius={1}
          source={{ uri: story.image }}
          style={styles.pageImage}
        />
      )}
      <View style={styles.pageMeta}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={bottomGradientColors}
        />
        <Avatar
          username={story.creator.username}
          href={story.creator.profilePicture}
          size={12}
        />
        <View style={styles.pageMetaText}>
          <Text bold size="2xl">
            {story.creator.username}
          </Text>
          <Spacer y={2} />
          <Text bold="medium">{story.text}</Text>
        </View>
      </View>
      <View style={styles.pageNowPlaying}>
        <StoryPagerNowPlaying
          fetching={fetching}
          trackId={data?.nowPlaying?.currentTrack?.trackId}
        />
      </View>
      <View style={styles.pageBottom}>
        <Button onPress={gotoStory}>{t("story.go_to_story")}</Button>
      </View>
    </View>
  );
};

export const StoryPager: FC<{
  stories: Story[];
  visible: boolean;
  onClose(): void;
  onStoryPaged(story: Story): void;
  onStoryNavigated(story: Story): void;
}> = ({ stories, visible, onClose, onStoryPaged, onStoryNavigated }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    if (visible) {
      bottomSheetRef.current.present();
    } else bottomSheetRef.current.dismiss();
  }, [visible, onClose]);

  useBackHandlerDismiss(visible, onClose);

  const onPageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const story = stories[event.nativeEvent.position];
      if (story) onStoryPaged(story);
    },
    [stories, onStoryPaged]
  );

  return (
    <BottomSheetModal
      backgroundComponent={null}
      backdropComponent={null}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
    >
      <PagerView style={styles.root} onPageSelected={onPageSelected}>
        {stories.map((story) => (
          <StoryPagerItem
            onNavigate={onStoryNavigated}
            key={story.id}
            story={story}
          />
        ))}
      </PagerView>
    </BottomSheetModal>
  );
};
