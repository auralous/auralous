import type { PlaybackCurrentContext } from "@auralous/player";
import { createContext } from "react";

export const PlayerComponentInternalContext = createContext(
  {} as {
    stopLiveIntention: null | {
      currentSessionId: string;
      intendedCurrentContext: PlaybackCurrentContext;
      dismiss(): void;
    };
  }
);
