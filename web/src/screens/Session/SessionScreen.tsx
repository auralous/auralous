import { NavPlaceholder } from "@/components/Layout";
import { NotFoundScreen } from "@/components/NotFound";
import type { Session } from "@auralous/api";
import { useSessionQuery } from "@auralous/api";
import {
  LoadingScreen,
  PageHeaderGradient,
  SessionScreenContent,
} from "@auralous/ui";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RouteComponentProps, StaticContext } from "react-router";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export const SessionScreen: FC<
  RouteComponentProps<{ id: string }, StaticContext>
> = ({ match, history, location }) => {
  const [{ data, fetching }] = useSessionQuery({
    variables: {
      id: match.params.id,
    },
    requestPolicy: "cache-and-network",
  });

  const onQuickShare = useCallback(
    (session: Session) => {
      history.push("/new/quick-share", {
        session,
      });
    },
    [history]
  );

  const isNew = useMemo(
    () => Boolean(new URLSearchParams(location.search).get("isNew")),
    [location.search]
  );

  return (
    <SafeAreaView style={styles.root}>
      <NavPlaceholder />
      <PageHeaderGradient image={data?.session?.image} />
      {fetching ? (
        <LoadingScreen />
      ) : data?.session ? (
        <>
          <SessionScreenContent
            session={data.session}
            onQuickShare={onQuickShare}
          />
          {/** TODO: Add Prompt */}
        </>
      ) : (
        <NotFoundScreen />
      )}
    </SafeAreaView>
  );
};
