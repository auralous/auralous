import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useUserQuery } from "@auralous/api";
import { HeaderBackable, LoadingScreen } from "@auralous/ui";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMeta from "./UserMeta";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const UserScreen: FC<StackScreenProps<ParamList, RouteName.User>> = ({
  route,
  navigation,
}) => {
  const username = route.params.username;
  const [{ data, fetching }] = useUserQuery({
    variables: { username },
    pause: !username,
  });
  return (
    <SafeAreaView style={styles.root}>
      <HeaderBackable onBack={navigation.goBack} title="" />
      {fetching ? (
        <LoadingScreen />
      ) : data?.user ? (
        <ScrollView>
          <UserMeta user={data.user} />
        </ScrollView>
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};

export default UserScreen;
