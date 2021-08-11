import { RouteName } from "@/screens/types";
import { User, useStoriesQuery } from "@auralous/api";
import player from "@auralous/player";
import { Colors, Size, Spacer, StoryCardItem } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  content: {
    padding: Size[4],
  },
  root: {
    flex: 1,
  },
});

export const UserTimeline: FC<{ user: User }> = ({ user }) => {
  // Pagination
  const [next, setNext] = useState<undefined | string>("");

  const [{ data, fetching, stale }] = useStoriesQuery({
    variables: {
      creatorId: user.id,
      next,
      limit: 10,
    },
    requestPolicy: "cache-and-network",
  });

  const loadMore = useCallback(() => {
    const stories = data?.stories;
    if (!stories?.length) return;
    setNext(stories[stories.length - 1].id);
  }, [data?.stories]);

  const navigation = useNavigation();

  const onStoryCardItemNavigate = useCallback(
    (storyId: string) => navigation.navigate(RouteName.Story, { id: storyId }),
    [navigation]
  );

  const onStoryCardPlay = useCallback(
    (storyId: string, index: number) =>
      player.playContext({
        id: storyId,
        initialIndex: index,
        type: "story",
        shuffle: false,
      }),
    []
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      onEnded={loadMore}
    >
      {data?.stories.map(
        (story) =>
          !story.isLive && (
            <View key={story.id}>
              <StoryCardItem
                story={story}
                onNavigate={onStoryCardItemNavigate}
                onPlay={onStoryCardPlay}
              />
              <Spacer y={4} />
            </View>
          )
      )}
      {fetching ||
        (stale && <ActivityIndicator color={Colors.textSecondary} />)}
    </ScrollView>
  );
};
