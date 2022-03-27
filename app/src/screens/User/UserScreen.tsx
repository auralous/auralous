import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { useUserQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserScreenContent } from "./components";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserScreen: FC<NativeStackScreenProps<ParamList, RouteName.User>> = ({
  route,
  navigation,
}) => {
  const username = route.params.username;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: username,
    });
  }, [navigation, username]);

  const [{ data, fetching }] = useUserQuery({
    variables: { username },
  });

  return (
    <SafeAreaView style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.user ? (
        <UserScreenContent user={data.user} />
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default UserScreen;
