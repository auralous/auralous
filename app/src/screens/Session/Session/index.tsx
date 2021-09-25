import { Container } from "@/components/Layout";
import type { Session } from "@auralous/api";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import SessionLiveContent from "./SessionLiveContent";
import SessionNonLiveContent from "./SessionNonLiveContent";

const styles = StyleSheet.create({
  root: {
    height: "100%",
  },
});

export const SessionScreenContent: FC<{
  session: Session;
  onQuickShare(session: Session): void;
}> = ({ session, onQuickShare }) => {
  return (
    <Container style={styles.root}>
      {session.isLive ? (
        <SessionLiveContent session={session} />
      ) : (
        <SessionNonLiveContent session={session} onQuickShare={onQuickShare} />
      )}
    </Container>
  );
};
