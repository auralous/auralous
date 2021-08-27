import { NotFoundScreen } from "@/components/NotFound";
import { ParamList, RouteName } from "@/screens/types";
import {
  User,
  useSessionListenersQuery,
  useSessionListenersUpdatedSubscription,
} from "@auralous/api";
import { LoadingScreen, SocialUserList } from "@auralous/ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const SessionListenersScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.SessionListeners>
> = ({ navigation, route }) => {
  const [{ data, fetching }] = useSessionListenersQuery({
    variables: {
      id: route.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  useSessionListenersUpdatedSubscription({
    variables: {
      id: route.params.id,
    },
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
      ) : data?.sessionListeners ? (
        <SocialUserList
          userIds={data?.sessionListeners || null}
          onUnauthenticated={onUnauthenticated}
          onPressItem={onPressItem}
        />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default SessionListenersScreen;
