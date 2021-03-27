export const FRAGMENT_NOW_PLAYING_QUEUE = /* GraphQL */ `
  fragment NowPlayingQueueParts on NowPlayingQueueItem {
    index
    trackId
    playedAt
    endedAt
    creatorId
  }
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

export const MUTATION_NOW_PLAYING_SKIP = /* GraphQL */ `
  mutation nowPlayingSkip($id: ID!) {
    nowPlayingSkip(id: $id)
  }
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

export const QUERY_NOW_PLAYING_REACTION = /* GraphQL */ `
  query nowPlayingReactions($id: ID!) {
    nowPlayingReactions(id: $id) {
      reaction
      userId
    }
  }
`;

export const SUBSCRIPTION_NOW_PLAYING_REACTION = /* GraphQL */ `
  subscription nowPlayingReactionsUpdated($id: ID!) {
    nowPlayingReactionsUpdated(id: $id) {
      reaction
      userId
    }
  }
`;

export const MUTATION_NOW_PLAYING_REACT = /* GraphQL */ `
  mutation nowPlayingReact($id: ID!, $reaction: NowPlayingReactionType!) {
    nowPlayingReact(id: $id, reaction: $reaction)
  }
`;
