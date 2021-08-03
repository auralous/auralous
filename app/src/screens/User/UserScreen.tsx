import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import { useUserQuery } from "@auralous/api";
import { LoadingScreen } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import UserMeta from "./components/UserMeta";

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
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.user ? (
        <ScrollView>
          <UserMeta user={data.user} />
        </ScrollView>
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default UserScreen;
