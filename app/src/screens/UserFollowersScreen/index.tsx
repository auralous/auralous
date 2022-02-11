import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { isTruthy } from "@/utils/utils";
import { SocialUserList } from "@/views/User";
import {
  useUserFollowersQuery,
  useUserQuery,
  useUsersQuery,
} from "@auralous/api";
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
  });

  const [{ data, fetching: fetchingList }] = useUserFollowersQuery({
    variables: { id: dataUser?.user?.id || "" },
    pause: !dataUser?.user,
  });

  const [{ data: dataUsers, fetching: fetchingUsers }] = useUsersQuery({
    variables: {
      ids: data?.userFollowers || [],
    },
    pause: !data?.userFollowers.length,
  });

  const users = dataUsers?.users?.filter(isTruthy);

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : dataUser?.user ? (
        <SocialUserList
          users={users || null}
          fetching={fetchingList || fetchingUsers}
        />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default UserFollowersScreen;
