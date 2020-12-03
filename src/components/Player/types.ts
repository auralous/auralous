import { Track, PlatformName } from "~/graphql/gql.gen";
import Player from "./Player";
import { useCrossTracks } from "~/hooks/track";

export type PlayerPlaying = Track | null;

export interface IPlayerContext {
  state: {
    playerPlaying: PlayerPlaying;
    playingRoomId: string;
    crossTracks: ReturnType<typeof useCrossTracks>[0];
    playingPlatform: PlatformName;
    fetching: boolean;
  };
  playRoom: (roomId: string) => void;
  stopPlaying: () => void;
  player: Player;
}
