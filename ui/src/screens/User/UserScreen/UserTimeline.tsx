import { SessionCardItem, Spacer } from "@/components";
import { Colors, Size } from "@/styles";
import type { Session } from "@auralous/api";
import player from "@auralous/player";
import { useNavigation } from "@react-navigation/native";
import type { FC } from "react";
import { useCallback } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  content: {
    padding: Size[4],
  },
});

export const UserTimeline: FC<{
  fetching: boolean;
  sessions: Session[];
}> = ({ fetching, sessions }) => {
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

  const navigation = useNavigation();

  return (
    <View style={styles.content}>
      {sessions.map(
        (session) =>
          !session.isLive && (
            <View key={session.id}>
              <SessionCardItem
                session={session}
                onNavigate={(sessionId) =>
                  navigation.navigate("session", { id: sessionId })
                }
                onPlay={onSessionCardPlay}
              />
              <Spacer y={4} />
            </View>
          )
      )}
      {fetching && <ActivityIndicator color={Colors.textSecondary} />}
    </View>
  );
};
