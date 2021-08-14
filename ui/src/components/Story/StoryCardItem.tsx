import { IconPlay, SvgByPlatformName } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { Colors, Size } from "@/styles";
import { Story, Track, useStoryTracksQuery } from "@auralous/api";
import { FC, useCallback } from "react";
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
});

interface StoryCardItemProps {
  story: Story;
  onNavigate(storyId: string): void;
  onPlay(storyId: string, index: number): void;
}

const StoryCardItemTrack: FC<{ track: Track; index: number; onPress(): void }> =
  ({ track, index, onPress }) => {
    const SvgPlatformName = SvgByPlatformName[track.platform];

    return (
      <View style={styles.trackItem}>
        <Text size="sm" color="textSecondary" style={styles.trackItemIndex}>
          {index + 1}
        </Text>
        <View style={styles.trackItemTrack}>
          <TouchableOpacity onPress={onPress} style={styles.trackTitle}>
            {SvgPlatformName && (
              <SvgPlatformName
                width={Size[4]}
                height={Size[4]}
                fill={Colors.textSecondary}
              />
            )}
            <Spacer x={1} />
            <Text size="sm" color="textSecondary" numberOfLines={1}>
              {track.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

const StoryCardItem: FC<StoryCardItemProps> = ({
  story,
  onNavigate,
  onPlay,
}) => {
  const { t } = useTranslation();

  const [{ data: dataStoryTracks }] = useStoryTracksQuery({
    variables: {
      id: story.id,
      from: 0,
      to: 2,
    },
  });

  const gotoStory = useCallback(
    () => onNavigate(story.id),
    [onNavigate, story.id]
  );

  return (
    <View style={styles.root}>
      <Pressable onPress={gotoStory} style={styles.head}>
        <Avatar username={story.creator.username} size={12} />
        <View style={styles.headMeta}>
          <View style={styles.headMetaTop}>
            <Text bold="medium" color="textSecondary">
              {story.creator.username}
            </Text>
            <Spacer x={1} />
            <Text size="sm" color="textTertiary">
              {story.createdAt.toLocaleDateString()}
            </Text>
          </View>
          <Spacer y={2} />
          <Text bold>{story.text}</Text>
        </View>
      </Pressable>
      <View style={styles.main}>
        <View style={styles.mainPlay}>
          {story.image && (
            <Image
              source={{ uri: story.image }}
              style={styles.bg}
              blurRadius={4}
            />
          )}
          <TouchableOpacity
            style={styles.mainPlayButton}
            onPress={() => onPlay(story.id, 0)}
          >
            <IconPlay stroke="#ffffff" fill="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          {dataStoryTracks?.storyTracks?.map((item, index) => (
            <StoryCardItemTrack
              key={`${index}${item.id}`}
              track={item}
              index={index}
              onPress={() => onPlay(story.id, index)}
            />
          ))}
          <Spacer y={1.5} />
          <TouchableOpacity onPress={gotoStory}>
            <Text size="sm" align="center">
              {t("playlist.view_all_x_songs", { count: story.trackTotal })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StoryCardItem;
