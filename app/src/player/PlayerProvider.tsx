import { PlayerProvider as OriginalPlayerProvider } from "@auralous/player";
import { FC } from "react";
import { useClient } from "urql";
import { useTrackColor } from "./useTrackColor";

export const PlayerProvider: FC = ({ children }) => {
  const client = useClient();

  return (
    <OriginalPlayerProvider client={client} useTrackColor={useTrackColor}>
      {children}
    </OriginalPlayerProvider>
  );
};
