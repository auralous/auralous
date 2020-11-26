import { Track, PlatformName } from "~/graphql/gql.gen";
import Player from "./Player";

export type PlayerPlaying = Track | null;

export interface IPlayerContext {
  state: {
    playerPlaying: PlayerPlaying;
    playingRoomId: string;
    originalTrack: Track | null | undefined;
    playingPlatform: PlatformName | null;
    guestPlayingPlatform: PlatformName | null;
    fetching: boolean;
    error?: PlayerError | null;
  };
  playRoom: (roomId: string) => void;
  stopPlaying: () => void;
  player: Player;
  setGuestPlayingPlatform: React.Dispatch<
    React.SetStateAction<PlatformName | null>
  >;
}

export enum PlayerError {
  NOT_AVAILABLE_ON_PLATFORM = "notAvailableOnPlatform",
}
