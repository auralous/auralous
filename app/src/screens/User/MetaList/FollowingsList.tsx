import { User, useUserFollowingsQuery } from "@/gql/gql.gen";
import React from "react";
import { ListRenderItem } from "react-native";
import List from "./List";
import ListUserItem from "./ListItem";
import useStoreBottomSheet from "./store";

interface FollowingsList {
  user: User;
}

const renderItem: ListRenderItem<string> = ({ item }) => (
  <ListUserItem id={item} />
);

const FollowingsList: React.FC<FollowingsList> = ({ user }) => {
  const list = useStoreBottomSheet((state) => state.list);

  const visible = list === "followings";

  const [
    { data: { userFollowings } = { userFollowings: undefined }, fetching },
    fetchFollowings,
  ] = useUserFollowingsQuery({
    variables: { id: user.id },
    pause: !visible,
  });

  return (
    <List
      visible={visible}
      renderItem={renderItem}
      data={userFollowings}
      keyExtractor={(item: string) => item}
      fetching={fetching}
      listName="followings"
      username={user.username}
      onRefresh={fetchFollowings}
    />
  );
};

export default FollowingsList;
