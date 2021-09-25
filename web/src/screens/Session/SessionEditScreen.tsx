import { NotFoundScreen } from "@/components/NotFound";
import { useSessionQuery } from "@auralous/api";
import { LoadingScreen, SessionEditScreenContent } from "@auralous/ui";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import type { RouteComponentProps } from "react-router";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export const SessionEditScreen: FC<RouteComponentProps<{ id: string }>> = ({
  match,
}) => {
  const [{ data, fetching }] = useSessionQuery({
    variables: {
      id: match.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  return (
    <View style={styles.root}>
      {fetching ? (
        <LoadingScreen />
      ) : data?.session ? (
        <SessionEditScreenContent session={data.session} />
      ) : (
        <NotFoundScreen />
      )}
    </View>
  );
};
