import type { RecyclerRenderItem } from "@/components";
import { LoadingScreen, RecyclerList, UserListItem } from "@/components";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles";
import type { Maybe } from "@auralous/api";
import { useUserQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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

const renderItem: RecyclerRenderItem<string> = ({ item }) => (
  <UserItem key={item} id={item} />
);

export const SocialUserList: FC<SocialUserListProps> = ({
  userIds,
  fetching,
}) => {
  return (
    <RecyclerList
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      data={userIds || []}
      height={Size[10] + Size[3]} // height + seperator
      renderItem={renderItem}
    />
  );
};
