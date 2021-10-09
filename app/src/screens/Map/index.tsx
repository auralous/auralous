import player from "@/player";
import type { ParamList, RouteName } from "@/screens/types";
import type { Session } from "@auralous/api";
import { useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import LiveSessionIntentionCheck from "./components/LiveSessionIntentionCheck";
import MapController from "./components/MapController";
import { SessionPager } from "./components/SessionPager";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const MapScreen: FC<NativeStackScreenProps<ParamList, RouteName.Map>> = () => {
  const pageInteracted = useRef(false);

  const [sessions, setSessions] = useState<Session[]>([]);

  const onClose = useCallback(() => {
    // in the case there is current session, closing the page
    // ny clicking go back on "you must end current session"
    // prompt will stop the playback)
    if (!pageInteracted.current) return;
    player.playContext(null);
    setSessions([]);
  }, []);

  const onSessionPaged = useCallback((session: Session) => {
    pageInteracted.current = true;
    player.playContext({
      id: session.id,
      shuffle: false,
      type: "session",
    });
  }, []);

  useEffect(() => {
    if (sessions[0]) onSessionPaged(sessions[0]);
  }, [onSessionPaged, sessions]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      // remove if navigate away
      onClose();
    }
  }, [isFocused, onClose]);

  return (
    <View style={styles.root}>
      <LiveSessionIntentionCheck />
      <MapController setSessions={setSessions} />
      <SessionPager
        sessions={sessions}
        onClose={onClose}
        visible={sessions.length > 0}
        onSessionPaged={onSessionPaged}
      />
    </View>
  );
};

export default MapScreen;
