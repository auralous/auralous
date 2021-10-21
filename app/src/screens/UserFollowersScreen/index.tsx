import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { SocialUserList } from "@/views/User";
import { useUserFollowersQuery, useUserQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserFollowersScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.UserFollowers>
> = ({ route }) => {
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

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : user ? (
        <SocialUserList
          userIds={data?.userFollowers || null}
          fetching={fetchingList}
        />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default UserFollowersScreen;
