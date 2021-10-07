import type { Session } from "@auralous/api";
import type { FC } from "react";
import SessionLiveContent from "./SessionLiveContent";
import SessionNonLiveContent from "./SessionNonLiveContent";

export const SessionScreenContent: FC<{
  session: Session;
  onQuickShare(session: Session): void;
}> = ({ session, onQuickShare }) => {
  return session.isLive ? (
    <SessionLiveContent session={session} />
  ) : (
    <SessionNonLiveContent session={session} onQuickShare={onQuickShare} />
  );
};
