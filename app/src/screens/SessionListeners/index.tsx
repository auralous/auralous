import { LoadingScreen } from "@/components/Loading";
import { NotFoundScreen } from "@/components/NotFound";
import type { ParamList, RouteName } from "@/screens/types";
import { Size } from "@/styles/spacing";
import { SocialUserList } from "@/views/User";
import {
  useSessionListenersQuery,
  useSessionListenersUpdatedSubscription,
} from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: Size[2] },
});

const SessionListenersScreen: FC<
  NativeStackScreenProps<ParamList, RouteName.SessionListeners>
> = ({ route }) => {
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

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.sessionListeners ? (
        <SocialUserList userIds={data?.sessionListeners || null} />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};

export default SessionListenersScreen;
