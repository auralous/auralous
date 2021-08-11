import { Story, useNowPlayingQuery, useTrackQuery } from "@auralous/api";
import { Avatar, Button, Colors, imageSources, Size, Text } from "@auralous/ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FC, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";

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

const StoryPagerNowPlaying: FC<{ trackId: string }> = ({ trackId }) => {
  const [{ data: dataTrack }] = useTrackQuery({
    variables: { id: trackId },
  });

  if (!dataTrack?.track) return null;

  return (
    <View>
      <View style={styles.pageNowPlayingImage}>
        <Image
          source={
            dataTrack.track.image
              ? { uri: dataTrack.track.image }
              : imageSources.defaultTrack
          }
          defaultSource={imageSources.defaultTrack}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
      </View>
      <View style={styles.pageNowPlayingImageMeta}>
        <Text size="xl" bold numberOfLines={1}>
          {dataTrack.track.title}
        </Text>
        <Text numberOfLines={1}>
          {dataTrack.track.artists.map((artist) => artist.name).join(", ")}
        </Text>
      </View>
    </View>
  );
};

const StoryPagerItem: FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();
  const [{ data }] = useNowPlayingQuery({
    variables: {
      id: story.id,
    },
  });

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
          <Text>{story.text}</Text>
        </View>
      </View>
      <View style={styles.pageNowPlaying}>
        {data?.nowPlaying?.currentTrack && (
          <StoryPagerNowPlaying
            trackId={data.nowPlaying.currentTrack.trackId}
          />
        )}
      </View>
      <View style={styles.pageBottom}>
        <Button>{t("story.go_to_story")}</Button>
      </View>
    </View>
  );
};

export const StoryPager: FC<{
  stories: Story[];
  visible: boolean;
  onClose(): void;
  onStoryPaged(story: Story): void;
}> = ({ stories, visible, onClose, onStoryPaged }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    if (visible) {
      bottomSheetRef.current.present();
      const bhe = BackHandler.addEventListener("hardwareBackPress", () => {
        onClose();
        return true;
      });
      return bhe.remove;
    } else bottomSheetRef.current.dismiss();
  }, [visible, onClose]);

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
          <StoryPagerItem key={story.id} story={story} />
        ))}
      </PagerView>
    </BottomSheetModal>
  );
};
