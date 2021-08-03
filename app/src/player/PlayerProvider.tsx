import { PlayerProvider as OriginalPlayerProvider } from "@auralous/player";
import { FC } from "react";
import { useTrackColor } from "./useTrackColor";

export const PlayerProvider: FC = ({ children }) => {
  return (
    <OriginalPlayerProvider useTrackColor={useTrackColor}>
      {children}
    </OriginalPlayerProvider>
  );
};
