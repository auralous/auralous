import { Track, Room } from "~/graphql/gql.gen";

export type PlayerPlaying = Track | null;
export interface IPlayerContext {
  room?: Room | null;
}

export enum PlayerError {
  NOT_AVAILABLE_ON_PLATFORM,
}
