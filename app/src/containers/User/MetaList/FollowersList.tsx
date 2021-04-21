import { User, useUserFollowersQuery } from "gql/gql.gen";
import React from "react";
import { ListRenderItem } from "react-native";
import List from "./List";
import ListUserItem from "./ListItem";
import useStoreBottomSheet from "./store";

interface FollowersList {
  user: User;
}

const renderItem: ListRenderItem<string> = ({ item }) => (
  <ListUserItem key={item} id={item} />
);

const FollowersList: React.FC<FollowersList> = ({ user }) => {
  const list = useStoreBottomSheet((state) => state.list);

  const visible = list === "followers";

  const [
    { data: { userFollowers } = { userFollowers: undefined }, fetching },
    fetchFollowers,
  ] = useUserFollowersQuery({
    variables: { id: user.id },
    pause: !visible,
  });

  return (
    <List
      visible={visible}
      renderItem={renderItem}
      data={userFollowers}
      keyExtractor={(item: string) => item}
      fetching={fetching}
      listName="followers"
      username={user.username}
      onRefresh={fetchFollowers}
    />
  );
};

export default FollowersList;
