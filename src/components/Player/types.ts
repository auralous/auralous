import { Track } from "~/graphql/gql.gen";
import Player from "./Player";
import { useCrossTracks } from "~/hooks/track";

export type PlayerPlaying = Track | null;

export interface IPlayerContext {
  state: {
    playerPlaying: PlayerPlaying;
    playingStoryId: string;
    crossTracks: ReturnType<typeof useCrossTracks>[0];
    fetching: boolean;
  };
  playStory: (storyId: string) => void;
  playQueueItem?: (id: string) => void;
  skipForward?: () => void;
  skipBackward?: () => void;
  player: Player;
}
