import { FRAGMENT_CROSS_TRACK_WRAPPER } from "./track";

export const FRAGMENT_NOW_PLAYING_QUEUE = /* GraphQL */ `
  fragment NowPlayingQueueParts on NowPlayingQueueItem {
    id
    trackId
    tracks {
      ...CrossTracksParts
    }
    playedAt
  }

  ${FRAGMENT_CROSS_TRACK_WRAPPER}
`;

export const QUERY_NOW_PLAYING = /* GraphQL */ `
  query nowPlaying($id: ID!) {
    nowPlaying(id: $id) {
      id
      currentTrack {
        ...NowPlayingQueueParts
      }
    }
  }
  ${FRAGMENT_NOW_PLAYING_QUEUE}
`;

export const SUBSCRIPTION_NOW_PLAYING = /* GraphQL */ `
  subscription onNowPlayingUpdated($id: ID!) {
    nowPlayingUpdated(id: $id) {
      id
      currentTrack {
        ...NowPlayingQueueParts
      }
    }
  }
  ${FRAGMENT_NOW_PLAYING_QUEUE}
`;

const FRAGMENT_NOW_PLAYING_REACTION = /* GraphQL */ `
  fragment NowPlayingReactionParts on NowPlayingReaction {
    id
    heart
    crying
    tear_joy
    fire
    mine
  }
`;

export const QUERY_NOW_PLAYING_REACTION = /* GraphQL */ `
  query nowPlayingReactions($id: ID!) {
    nowPlayingReactions(id: $id) {
      ...NowPlayingReactionParts
    }
  }
  ${FRAGMENT_NOW_PLAYING_REACTION}
`;

export const SUBSCRIPTION_NOW_PLAYING_REACTION = /* GraphQL */ `
  subscription onNowPlayingReactionsUpdated($id: ID!) {
    nowPlayingReactionsUpdated(id: $id) {
      ...NowPlayingReactionParts
    }
  }
  ${FRAGMENT_NOW_PLAYING_REACTION}
`;

export const MUTATION_REACT_NOW_PLAYING = /* GraphQL */ `
  mutation reactNowPlaying($id: ID!, $reaction: NowPlayingReactionType!) {
    reactNowPlaying(id: $id, reaction: $reaction)
  }
`;
