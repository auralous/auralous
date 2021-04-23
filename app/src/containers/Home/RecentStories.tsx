import { StoryItem } from "@/components/Story";
import { Story, useStoriesQuery, useUserQuery } from "@/gql/gql.gen";
import { Size } from "@/styles";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  storyItemWrapper: {
    marginRight: Size[4],
  },
});

const StoryItemWithData: React.FC<{ story: Story }> = ({ story }) => {
  const [{ data: { user } = { user: undefined } }] = useUserQuery({
    variables: { id: story.creatorId },
  });

  return (
    <>
      <View style={styles.storyItemWrapper}>
        <StoryItem story={story} creator={user || null} />
      </View>
    </>
  );
};

const RecentStories: React.FC = () => {
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { id: "PUBLIC", limit: 8 },
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {stories?.map((story) => (
        <StoryItemWithData key={story.id} story={story} />
      ))}
    </ScrollView>
  );
};

export default RecentStories;
