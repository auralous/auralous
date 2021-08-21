import { PlaybackCurrentContext } from "@auralous/player";
import { createContext } from "react";

export const PlayerComponentInternalContext = createContext(
  {} as {
    stopLiveIntention: null | {
      currentStoryId: string;
      intendedCurrentContext: PlaybackCurrentContext;
      dismiss(): void;
    };
  }
);
