import player from "@/player";
import type { ParamList } from "@/screens/types";
import { RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { MapMap } from "./components/MapMap";
import { SessionPager } from "./components/SessionPager";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const MapScreen: FC<NativeStackScreenProps<ParamList, RouteName.Map>> = ({
  navigation,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const onClose = useCallback(() => {
    player.playContext(null);
    setSessions([]);
  }, []);

  const onSessionPaged = useCallback((session: Session) => {
    player.playContext({
      id: session.id,
      shuffle: false,
      type: "session",
    });
  }, []);

  const onSessionNavigated = useCallback(
    (session: Session) => {
      navigation.goBack();
      navigation.navigate(RouteName.Session, { id: session.id });
    },
    [navigation]
  );

  return (
    <View style={styles.root}>
      <MapMap setSessions={setSessions} />
      <SessionPager
        sessions={sessions}
        onClose={onClose}
        visible={sessions.length > 0}
        onSessionPaged={onSessionPaged}
        onSessionNavigated={onSessionNavigated}
      />
    </View>
  );
};

export default MapScreen;
