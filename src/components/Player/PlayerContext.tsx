import React from "react";
import { PlatformName, Track } from "~/graphql/gql.gen";
import Player from "./Player";
import { PlayerPlaying, IPlayerContext, PlayerError } from "./types";

const PlayerContext = React.createContext<{
  state: {
    playerPlaying: PlayerPlaying;
    playerContext: IPlayerContext;
    playingRoomId: string;
    originalTrack: Track | null | undefined;
    playingPlatform: PlatformName | null;
    fetching: boolean;
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
