import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import type { User } from "@auralous/api";
import { useUserFollowersQuery, useUserQuery } from "@auralous/api";
import { LoadingScreen, SocialUserList } from "@auralous/ui";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserFollowersScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.UserFollowers>
> = ({ route, navigation }) => {
  const username = route.params.username;
  const [{ data: dataUser, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  const user = dataUser?.user;

  const [{ data, fetching: fetchingList }] = useUserFollowersQuery({
    variables: { id: user?.id || "" },
    pause: !user,
  });

  const onUnauthenticated = useCallback(
    () => navigation.navigate(RouteName.SignIn),
    [navigation]
  );

  const onPressItem = useCallback(
    (user: User) => {
      navigation.navigate(RouteName.User, { username: user.username });
    },
    [navigation]
  );

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : user ? (
        <SocialUserList
          userIds={data?.userFollowers || null}
          fetching={fetchingList}
          onUnauthenticated={onUnauthenticated}
          onPressItem={onPressItem}
        />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default UserFollowersScreen;
