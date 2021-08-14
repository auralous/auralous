import { GradientButton } from "@/components/Button";
import { RouteName } from "@/screens/types";
import {
  Story,
  useNowPlayingQuery,
  useStoryUsersQuery,
  useTrackQuery,
} from "@auralous/api";
import player, { usePlaybackCurrentContext } from "@auralous/player";
import {
  Button,
  Colors,
  IconUser,
  Size,
  Spacer,
  Text,
  TrackItem,
} from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import StoryMeta from "./StoryMeta";

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: Size[1],
  },
  content: {
    padding: Size[3],
  },
  tag: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textLive: {
    textTransform: "uppercase",
  },
  track: {
    marginTop: Size[1],
    padding: Size[1],
  },
});

const StoryLiveContent: FC<{ story: Story }> = ({ story }) => {
  const playbackCurrentContext = usePlaybackCurrentContext();

  const { t } = useTranslation();

  // FIXME: create more lightweight queries like useStoryUsersCount()
  const [{ data: dataStoryUsers }] = useStoryUsersQuery({
    variables: {
      id: story.id,
    },
  });

  const joinLive = useCallback(() => {
    player.playContext({
      id: story.id,
      type: "story",
      shuffle: false,
    });
  }, [story]);

  const navigation = useNavigation();

  const viewCollabs = useCallback(() => {
    navigation.navigate(RouteName.StoryCollaborators, { id: story.id });
  }, [navigation, story.id]);

  const [{ data: dataNowPlaying }] = useNowPlayingQuery({
    variables: { id: story.id },
  });
  const [{ data: dataTrack, fetching: fetchingTrack }] = useTrackQuery({
    variables: { id: dataNowPlaying?.nowPlaying?.currentTrack?.trackId || "" },
    pause: !dataNowPlaying?.nowPlaying,
  });

  const track = dataNowPlaying?.nowPlaying ? dataTrack?.track : null;

  return (
    <>
      <StoryMeta
        story={story}
        tagElement={
          <View style={styles.tag}>
            <Text bold size="sm" style={styles.textLive}>
              {t("common.status.live")}{" "}
            </Text>
            <Text size="sm">
              {t("story.title")} • {dataStoryUsers?.storyUsers?.length || 0}
            </Text>
            <IconUser color={Colors.primaryText} width={12} height={12} />
          </View>
        }
      />
      <View style={styles.buttons}>
        <GradientButton
          disabled={
            playbackCurrentContext?.type === "story" &&
            playbackCurrentContext.id === story.id
          }
          onPress={joinLive}
        >
          {t("story.join_live")}
        </GradientButton>
        <Spacer x={2} />
        <View>
          <Button onPress={viewCollabs}>{t("collab.title")}</Button>
        </View>
      </View>
      <View style={styles.content}>
        <Text bold>{t("now_playing.title")}</Text>
        <View style={styles.track}>
          {dataNowPlaying?.nowPlaying?.currentTrack && (
            <TrackItem track={track || null} fetching={fetchingTrack} />
          )}
        </View>
      </View>
    </>
  );
};

export default StoryLiveContent;
