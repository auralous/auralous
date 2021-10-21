import { LoadingScreen } from "@/components/Loading";
import { Spacer } from "@/components/Spacer";
import { UserListItem } from "@/components/User";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { Maybe } from "@auralous/api";
import { useUserQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { UserFollowButton } from "./UserFollowButton";

interface SocialUserListProps {
  userIds: Maybe<string[]>;
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

const UserItem: FC<{ id: string }> = ({ id }) => {
  const [{ data, fetching }] = useUserQuery({ variables: { id } });

  const navigation = useNavigation();

  const onPress = useCallback(
    () =>
      data?.user &&
      navigation.navigate(RouteName.User, { username: data.user.username }),
    [navigation, data?.user]
  );

  return (
    <View style={styles.itemRoot}>
      <Pressable onPress={onPress} style={styles.itemInfo}>
        <UserListItem user={data?.user || null} fetching={fetching} />
      </Pressable>
      <UserFollowButton id={id} />
    </View>
  );
};

const itemHeight = Size[10] + Size[2];
const renderItem: ListRenderItem<string> = ({ item }) => (
  <UserItem key={item} id={item} />
);
const getItemLayout = (data: unknown, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});
const ItemSeparatorComponent = () => <Spacer y={2} />;

export const SocialUserList: FC<SocialUserListProps> = ({
  userIds,
  fetching,
}) => {
  return (
    <FlatList
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      ItemSeparatorComponent={ItemSeparatorComponent}
      data={userIds || []}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={0}
      removeClippedSubviews
      windowSize={10}
    />
  );
};
