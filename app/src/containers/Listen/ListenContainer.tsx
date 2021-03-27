import StoryItem from "components/Story/StoryItem";
import { useStoriesQuery } from "gql/gql.gen";
import { useMe } from "gql/hooks";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Size } from "styles";

const Header: React.FC = () => {
  const me = useMe();
  return <View>{me?.user.username}</View>;
};

const LIMIT = 10;

const ListenContainer: React.FC = () => {
  // Pagination
  const [next, setNext] = useState<undefined | string>("");
  const [{ data: { stories } = { stories: undefined } }] = useStoriesQuery({
    variables: { id: "PUBLIC", next, limit: LIMIT },
  });

  console.log(stories);

  return (
    <ScrollView style={{ padding: Size[4] }}>
      {stories?.map((story) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </ScrollView>
  );
};

export default ListenContainer;
