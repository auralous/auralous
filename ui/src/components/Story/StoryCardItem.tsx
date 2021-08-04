import { IconPlay, SvgByPlatformName } from "@/assets";
import { Avatar } from "@/components/Avatar";
import { Spacer } from "@/components/Spacer";
import { Text } from "@/components/Typography";
import { makeStyles, Size, useColors } from "@/styles";
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
  },
  headMetaTop: {
    alignItems: "center",
    flexDirection: "row",
  },
  mainPlay: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .5)",
    borderRadius: 9999,
    height: Size[14],
    justifyContent: "center",
    margin: Size[2],
    width: Size[14],
  },
  mainRight: {
    flex: 1,
  },
  root: {
    width: "100%",
  },
  trackItem: {
    alignItems: "center",
    flexDirection: "row",
  },
  trackItemTrack: {
    flex: 1,
  },
  trackTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
});

const useStyles = makeStyles((theme) => ({
  main: {
    padding: Size[2],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: Size[6],
    overflow: "hidden",
    flexDirection: "row",
  },
  trackItemIndex: {
    height: Size[6],
    width: Size[6],
    borderRadius: 9999,
    marginRight: Size[2],
    textAlign: "center",
    textAlignVertical: "center",
  },
}));

interface StoryCardItemProps {
  story: Story;
  onNavigate(storyId: string): void;
  onPlay(storyId: string, index: number): void;
}

const StoryCardItemTrack: FC<{ track: Track; index: number; onPress(): void }> =
  ({ track, index, onPress }) => {
    const dstyles = useStyles();

    const SvgPlatformName = SvgByPlatformName[track.platform];

    const colors = useColors();

    return (
      <View style={styles.trackItem}>
        <Text size="sm" color="textSecondary" style={dstyles.trackItemIndex}>
          {index + 1}
        </Text>
        <View style={styles.trackItemTrack}>
          <TouchableOpacity onPress={onPress} style={styles.trackTitle}>
            {SvgPlatformName && (
              <SvgPlatformName
                width={Size[4]}
                height={Size[4]}
                fill={colors.textSecondary}
              />
            )}
            <Spacer x={1} />
            <Text size="sm" color="textSecondary" numberOfLines={1}>
              {track?.title}
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
  const dstyles = useStyles();

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
          <Text bold>{story.text}</Text>
        </View>
      </Pressable>
      <View style={dstyles.main}>
        {story.image && (
          <Image
            source={{ uri: story.image }}
            style={styles.bg}
            blurRadius={4}
          />
        )}
        <View>
          <TouchableOpacity
            style={styles.mainPlay}
            onPress={() => onPlay(story.id, 0)}
          >
            <IconPlay stroke="#ffffff" fill="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.mainRight}>
          {dataStoryTracks?.storyTracks?.map((item, index) => (
            <StoryCardItemTrack
              key={`${index}${item.id}`}
              track={item}
              index={index}
              onPress={() => onPlay(story.id, index)}
            />
          ))}
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
