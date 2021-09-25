import { NotFoundScreen } from "@/components/NotFound";
import {
  useSessionListenersQuery,
  useSessionListenersUpdatedSubscription,
} from "@auralous/api";
import { LoadingScreen, SocialUserList } from "@auralous/ui";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import type { RouteComponentProps } from "react-router";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export const SessionListenersScreen: FC<RouteComponentProps<{ id: string }>> =
  ({ match }) => {
    const [{ data, fetching }] = useSessionListenersQuery({
      variables: {
        id: match.params.id,
      },
      requestPolicy: "cache-and-network",
    });

    useSessionListenersUpdatedSubscription({
      variables: {
        id: match.params.id,
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
