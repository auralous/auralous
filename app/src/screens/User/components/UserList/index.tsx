import {
  LoadingScreen,
  RecyclerList,
  RecyclerRenderItem,
  Size,
} from "@auralous/ui";
import { FC } from "react";
import { StyleSheet } from "react-native";
import ListUserItem from "./ListUserItem";

interface UserListProps {
  data: string[];
  fetching: boolean;
}

const listPadding = Size[4];

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: listPadding,
  },
});

const renderItem: RecyclerRenderItem<string> = ({ item }) => (
  <ListUserItem key={item} id={item} />
);

const UserList: FC<UserListProps> = ({ data, fetching }) => {
  return (
    <RecyclerList
      contentContainerStyle={styles.content}
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      data={data}
      height={Size[10] + Size[3]} // height + seperator
      renderItem={renderItem}
      contentHorizontalPadding={listPadding}
    />
  );
};

export default UserList;
