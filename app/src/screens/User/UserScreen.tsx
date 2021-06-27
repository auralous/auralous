import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useUserQuery } from "@auralous/api";
import { HeaderBackable } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { ScrollView } from "react-native";
import UserMeta from "./UserMeta";

const UserScreen: FC<StackScreenProps<ParamList, RouteName.User>> = ({
  route,
}) => {
  const username = route.params.username;
  const [{ data: { user } = { user: undefined }, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  return (
    <>
      <HeaderBackable title="" />
      {fetching ? (
        <LoadingScreen />
      ) : user ? (
        <ScrollView>
          <UserMeta user={user} />
        </ScrollView>
      ) : (
        <NotFoundScreen />
      )}
    </>
  );
};

export default UserScreen;
