import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useUserFollowingsQuery, useUserQuery } from "@auralous/api";
import { HeaderBackable, LoadingScreen } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserList from "./UserList/index";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserFollowingScreen: FC<
  StackScreenProps<ParamList, RouteName.UserFollowers>
> = ({ route, navigation }) => {
  const { t } = useTranslation();
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
    <SafeAreaView style={styles.root}>
      <HeaderBackable onBack={navigation.goBack} title={t("user.following")} />
      {fetching ? (
        <LoadingScreen />
      ) : user ? (
        <UserList data={data?.userFollowings || []} fetching={fetchingList} />
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default UserFollowingScreen;
