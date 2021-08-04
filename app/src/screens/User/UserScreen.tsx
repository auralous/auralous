import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useUserQuery } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMeta from "./components/UserMeta";
import { UserTimeline } from "./components/UserTimeline";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserScreen: FC<NativeStackScreenProps<ParamList, RouteName.User>> = ({
  route,
}) => {
  const username = route.params.username;
  const [{ data, fetching }] = useUserQuery({
    variables: { username },
  });
  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.user ? (
        <>
          <UserMeta user={data.user} />
          <UserTimeline user={data.user} />
        </>
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default UserScreen;
