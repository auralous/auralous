import { StoryItem } from "components/Story";
import { Story } from "gql/gql.gen";
import { useMe } from "gql/hooks";
import React from "react";
import { ScrollView } from "react-native";

const dummyStory: Story = {
  __typename: "Story",
  createdAt: new Date(),
  creatorId: "2gThTObAq1wi",
  id: "asdfasd",
  image:
    "https://i.pinimg.com/originals/14/62/86/146286407c7d9b963d07f2db221f4993.jpg",
  isLive: false,
  isPublic: true,
  queueable: [],
  text: "My First Story",
};

const RecentStories: React.FC = () => {
  const me = useMe();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <StoryItem story={dummyStory} creator={me?.user || null} />
    </ScrollView>
  );
};

export default RecentStories;
