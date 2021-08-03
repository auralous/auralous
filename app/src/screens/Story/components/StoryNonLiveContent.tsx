import { RouteName } from "@/screens/types";
import { Story, Track, useStoryTracksQuery } from "@auralous/api";
import player from "@auralous/player";
import {
  Button,
  LoadingScreen,
  RecyclerList,
  RecyclerRenderItem,
  Size,
  Spacer,
  Text,
  TrackItem,
} from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { createContext, FC, memo, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import StoryMeta from "./StoryMeta";

const listPadding = Size[3];
const itemPadding = Size[1];

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  tagText: {
    color: "#333333",
  },
  listContent: {
    padding: listPadding,
  },
  item: {
    padding: itemPadding,
    flexDirection: "row",
    alignItems: "center",
  },
  buttons: {
    padding: Size[1],
    flexDirection: "row",
    justifyContent: "center",
  },
});

const StoryIdContext = createContext("");

const StoryTrackItem = memo<{
  track: Track;
  index: number;
}>(function StoryTrackItem({ track, index }) {
  const storyId = useContext(StoryIdContext);
  const onPress = useCallback(
    () =>
      player.playContext({
        id: storyId,
        initialIndex: index,
        type: "story",
        shuffle: false,
      }),
    [storyId, index]
  );
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TrackItem track={track} key={index} />
    </TouchableOpacity>
  );
});

const renderItem: RecyclerRenderItem<Track> = ({ item, index }) => (
  <StoryTrackItem key={index} track={item} index={index} />
);

const StoryNonLiveContent: FC<{ story: Story }> = ({ story }) => {
  const { t } = useTranslation();

  const [{ data, fetching }] = useStoryTracksQuery({
    variables: { id: story.id },
  });

  const shufflePlay = useCallback(
    () =>
      player.playContext({
        id: story.id,
        type: "story",
        shuffle: true,
      }),
    [story]
  );

  const navigation = useNavigation();

  const quickPlay = useCallback(() => {
    navigation.navigate(RouteName.NewQuickShare, {
      story: {
        ...story,
        // erase createdAt since Date object breaks navigation
        createdAt: null,
      },
    });
  }, [story, navigation]);

  return (
    <>
      <StoryMeta
        story={story}
        tagElement={
          <View style={styles.tag}>
            <Text size="sm" style={styles.tagText}>
              {t("story.title")} •{" "}
              {data?.storyTracks
                ? t("playlist.x_song", { count: data.storyTracks.length })
                : ""}
            </Text>
          </View>
        }
      />
      <View style={styles.buttons}>
        <Button onPress={shufflePlay}>{t("player.shuffle_play")}</Button>
        <Spacer x={2} />
        <Button onPress={quickPlay} variant="primary">
          {t("new.quick_share.title")}
        </Button>
      </View>
      <StoryIdContext.Provider value={story.id}>
        <RecyclerList
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={fetching ? <LoadingScreen /> : null}
          data={data?.storyTracks || []}
          height={Size[12] + 2 * itemPadding + Size[3]} // height + 2 * padding + seperator
          renderItem={renderItem}
          contentHorizontalPadding={listPadding}
        />
      </StoryIdContext.Provider>
    </>
  );
};

export default StoryNonLiveContent;
