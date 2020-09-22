import React from "react";
import { PlatformName, Track } from "~/graphql/gql.gen";
import Player from "./Player";
import { PlayerPlaying, IPlayerContext, PlayerError } from "./types";

const PlayerContext = React.createContext<{
  state: {
    playerPlaying: PlayerPlaying;
    playerContext: IPlayerContext;
    playerControl: string;
    originalTrack: Track | null;
    playingPlatform: PlatformName | null;
    error?: PlayerError | null;
  };
  playRoom: (roomId: string) => void;
  stopPlaying: () => void;
  player: Player;
  forceResetPlayingPlatform: React.Dispatch<
    React.SetStateAction<Record<string, unknown>>
  >;
}>({} as any);

export default PlayerContext;
