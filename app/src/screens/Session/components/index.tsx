import type { Session } from "@auralous/api";
import type { FC } from "react";
import SessionLiveContent from "./SessionLiveContent";
import SessionNonLiveContent from "./SessionNonLiveContent";

export const SessionScreenContent: FC<{
  session: Session;
}> = ({ session }) => {
  return session.isLive ? (
    <SessionLiveContent session={session} />
  ) : (
    <SessionNonLiveContent session={session} />
  );
};
