import { RouteName } from "@/screens/types";
import { User, useSessionsQuery } from "@auralous/api";
import player from "@auralous/player";
import { Colors, SessionCardItem, Size, Spacer } from "@auralous/ui";
import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  content: {
    padding: Size[4],
  },
  root: {
    flex: 1,
  },
});

export const UserTimeline: FC<{ user: User }> = ({ user }) => {
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

  const navigation = useNavigation();

  const onSessionCardItemNavigate = useCallback(
    (sessionId: string) =>
      navigation.navigate(RouteName.Session, { id: sessionId }),
    [navigation]
  );

  const onSessionCardPlay = useCallback(
    (sessionId: string, index: number) =>
      player.playContext({
        id: sessionId,
        initialIndex: index,
        type: "session",
        shuffle: false,
      }),
    []
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      onEnded={loadMore}
    >
      {data?.sessions.map(
        (session) =>
          !session.isLive && (
            <View key={session.id}>
              <SessionCardItem
                session={session}
                onNavigate={onSessionCardItemNavigate}
                onPlay={onSessionCardPlay}
              />
              <Spacer y={4} />
            </View>
          )
      )}
      {fetching ||
        (stale && <ActivityIndicator color={Colors.textSecondary} />)}
    </ScrollView>
  );
};
