import { LoadingScreen } from "@/components/Loading";
import { ResultEmptyScreen } from "@/components/Result";
import { Spacer } from "@/components/Spacer";
import { UserListItem } from "@/components/User";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { Maybe, User } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { UserFollowButton } from "./UserFollowButton";

interface SocialUserListProps {
  users: Maybe<User[]>;
  fetching?: boolean;
}

const styles = StyleSheet.create({
  itemInfo: { flex: 1 },
  itemRoot: {
    alignItems: "center",
    flexDirection: "row",
    height: Size[10],
    paddingHorizontal: Size[4],
  },
});

const UserItem: FC<{ user: User }> = ({ user }) => {
  const navigation = useNavigation();

  const onPress = useCallback(
    () => navigation.navigate(RouteName.User, { username: user.username }),
    [navigation, user]
  );

  return (
    <View style={styles.itemRoot}>
      <Pressable onPress={onPress} style={styles.itemInfo}>
        <UserListItem user={user} />
      </Pressable>
      <UserFollowButton id={user.id} />
    </View>
  );
};

const itemHeight = Size[10] + Size[4];
const renderItem: ListRenderItem<User> = ({ item }) => (
  <UserItem key={item.id} user={item} />
);
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});
const ItemSeparatorComponent = () => <Spacer y={4} />;

export const SocialUserList: FC<SocialUserListProps> = ({
  users,
  fetching,
}) => {
  return (
    <FlatList
      ListEmptyComponent={fetching ? LoadingScreen : ResultEmptyScreen}
      ItemSeparatorComponent={ItemSeparatorComponent}
      data={users || []}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={0}
      removeClippedSubviews
      windowSize={10}
    />
  );
};
