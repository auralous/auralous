import { StoryItem } from "@/components/Story";
import { useStoriesQuery } from "@/gql/gql.gen";
import { usePlayer } from "@/player";
import { Size } from "@/styles";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  storyItemWrapper: {
    marginRight: Size[4],
  },
});

const RecentStories: React.FC = () => {
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { id: "PUBLIC", limit: 8 },
  });
  const player = usePlayer();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {stories?.map((story) => (
        <TouchableOpacity
          key={story.id}
          style={styles.storyItemWrapper}
          onPress={() => player.playContext(`story:${story.id}`)}
        >
          <StoryItem story={story} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default RecentStories;
