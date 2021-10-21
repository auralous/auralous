import type { Session } from "@auralous/api";
import type { FC } from "react";
import { SessionEditDelete } from "./SessionEditDelete";
import { SessionEditEnd } from "./SessionEditEnd";
import { SessionEditMeta } from "./SessionEditMeta";

export const SessionEditScreenContent: FC<{ session: Session }> = ({
  session,
}) => {
  return (
    <>
      {session.isLive && <SessionEditEnd session={session} />}
      <SessionEditMeta session={session} />
      <SessionEditDelete session={session} />
    </>
  );
};
