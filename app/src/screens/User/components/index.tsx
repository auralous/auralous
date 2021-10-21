import type { User } from "@auralous/api";
import { useSessionsQuery } from "@auralous/api";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import UserMeta from "./UserMeta";
import { UserTimeline } from "./UserTimeline";

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export const UserScreenContent: FC<{
  user: User;
}> = ({ user }) => {
  // Pagination
  const [next, setNext] = useState<undefined | string>("");

  const [{ data, fetching, stale }] = useSessionsQuery({
    variables: {
      creatorId: user.id,
      next,
      limit: 10,
    },
    requestPolicy: "cache-and-network",
  });

  const loadMore = useCallback(() => {
    const sessions = data?.sessions;
    if (!sessions?.length) return;
    setNext(sessions[sessions.length - 1].id);
  }, [data?.sessions]);

  return (
    <ScrollView onEnded={loadMore} style={styles.root}>
      <UserMeta user={user} />
      <UserTimeline
        sessions={data?.sessions || []}
        fetching={fetching || stale}
      />
    </ScrollView>
  );
};
