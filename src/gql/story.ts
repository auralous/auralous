export const FRAGMENT_STORY_DETAIL = /* GraphQL */ `
  fragment StoryDetailParts on Story {
    text
    image
    createdAt
    isPublic
    isLive
    creatorId
    queueable
  }
`;

export const QUERY_STORY = /* GraphQL */ `
  query story($id: ID!) {
    story(id: $id) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_STORIES = /* GraphQL */ `
  query stories($id: ID!, $next: String, $limit: Int!) {
    stories(id: $id, next: $next, limit: $limit) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_STORIES_ON_MAP = /* GraphQL */ `
  query storiesOnMap($lng: Float!, $lat: Float!, $radius: Float!) {
    storiesOnMap(lng: $lng, lat: $lat, radius: $radius) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_STORY_LIVE = /* GraphQL */ `
  query storyLive($creatorId: String) {
    storyLive(creatorId: $creatorId) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const MUTATION_STORY_CREATE = /* GraphQL */ `
  mutation storyCreate(
    $text: String!
    $isPublic: Boolean!
    $location: LocationInput
    $tracks: [ID!]!
  ) {
    storyCreate(
      text: $text
      isPublic: $isPublic
      location: $location
      tracks: $tracks
    ) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const MUTATION_STORY_CHANGE_QUEUEABLE = /* GraphQL */ `
  mutation storyChangeQueueable(
    $id: ID!
    $userId: String!
    $isRemoving: Boolean!
  ) {
    storyChangeQueueable(id: $id, userId: $userId, isRemoving: $isRemoving)
  }
`;

export const MUTATION_STORY_DELETE = /* GraphQL */ `
  mutation storyDelete($id: ID!) {
    storyDelete(id: $id)
  }
`;

export const MUTATION_STORY_UNLIVE = /* GraphQL */ `
  mutation storyUnlive($id: ID!) {
    storyUnlive(id: $id) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const QUERY_STORY_USERS = /* GraphQL */ `
  query storyUsers($id: ID!) {
    storyUsers(id: $id)
  }
`;

export const MUTATION_STORY_PING = /* GraphQL */ `
  mutation storyPing($id: ID!) {
    storyPing(id: $id)
  }
`;

export const SUBSCRIPTION_STORY = /* GraphQL */ `
  subscription storyUpdated($id: ID!) {
    storyUpdated(id: $id) {
      id
      ...StoryDetailParts
    }
  }
  ${FRAGMENT_STORY_DETAIL}
`;

export const SUBSCRIPTION_STORY_USERS = /* GraphQL */ `
  subscription storyUsersUpdated($id: ID!) {
    storyUsersUpdated(id: $id)
  }
`;

export const MUTATION_STORY_SEND_INVITES = /* GraphQL */ `
  mutation storySendInvites($id: ID!, $invitedIds: [String!]!) {
    storySendInvites(id: $id, invitedIds: $invitedIds)
  }
`;
