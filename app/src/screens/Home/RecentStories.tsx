import { useStoriesQuery } from "@auralous/api";
import player, { PlaybackContextType } from "@auralous/player";
import { Size, StoryItem } from "@auralous/ui";
import { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  storyItemWrapper: {
    marginRight: Size[4],
  },
});

const RecentStories: FC = () => {
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { id: "PUBLIC", limit: 8 },
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {stories?.map((story) => (
        <TouchableOpacity
          key={story.id}
          style={styles.storyItemWrapper}
          onPress={() =>
            player.playContext({
              type: PlaybackContextType.Story,
              id: story.id,
            })
          }
        >
          <StoryItem story={story} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RecentStories;
