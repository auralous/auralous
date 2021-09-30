import { LoadingScreen } from "@/components/Loading";
import { UserListItem } from "@/components/User";
import { RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import type { Maybe } from "@auralous/api";
import { useUserQuery } from "@auralous/api";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { BigListRenderItem } from "react-native-big-list";
import BigList from "react-native-big-list";
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

const renderItem: BigListRenderItem<string> = ({ item }) => (
  <UserItem key={item} id={item} />
);

export const SocialUserList: FC<SocialUserListProps> = ({
  userIds,
  fetching,
}) => {
  return (
    <BigList
      ListEmptyComponent={fetching ? <LoadingScreen /> : null}
      itemHeight={Size[10] + Size[3]} // height + 2 * padding + seperator
      data={userIds || []}
      renderItem={renderItem}
    />
  );
};
