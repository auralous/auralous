import { Track } from "gql/gql.gen";
import { useCrossTracks } from "hooks/track";
import Player from "./Player";

export type PlayerPlaying = Track | null;

export type IPlayerContext = [
  {
    player: Player;
    playerPlaying: PlayerPlaying;
    playingStoryId: string;
    playingQueueItemId: string | undefined;
    crossTracks: ReturnType<typeof useCrossTracks>[0];
    fetching: boolean;
  },
  {
    playStory: (storyId: string) => void;
    playQueueItem?: (id: string) => void;
    skipForward?: () => void;
    skipBackward?: () => void;
  }
];
