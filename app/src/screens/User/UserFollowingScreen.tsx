import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useUserFollowingsQuery, useUserQuery } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import UserList from "./components/UserList";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserFollowingScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.UserFollowers>
> = ({ route }) => {
  const username = route.params.username;
  const [{ data: dataUser, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  const user = dataUser?.user;

  const [{ data, fetching: fetchingList }] = useUserFollowingsQuery({
    variables: { id: user?.id || "" },
    pause: !user,
  });

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : user ? (
        <UserList data={data?.userFollowings || []} fetching={fetchingList} />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default UserFollowingScreen;
